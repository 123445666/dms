
using AutoMapper;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using FluentAssertions;
using Dms.Infrastructure.Data;
using Dms.Domain;
using Dms.Domain.Repositories.Interfaces;
using Dms.Crosscutting.Enums;
using Dms.Dto;
using Dms.Configuration.AutoMapper;
using Dms.Test.Setup;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using Xunit;

namespace Dms.Test.Controllers
{
    public class FilePartsControllerIntTest
    {
        public FilePartsControllerIntTest()
        {
            _factory = new AppWebApplicationFactory<TestStartup>().WithMockUser();
            _client = _factory.CreateClient();

            _filePartRepository = _factory.GetRequiredService<IFilePartRepository>();

            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile(new AutoMapperProfile());
            });
            _mapper = config.CreateMapper();

            InitTest();
        }

        private const string DefaultName = "AAAAAAAAAA";
        private const string UpdatedName = "BBBBBBBBBB";

        private static readonly byte[] DefaultContent = null;
        private static readonly byte[] UpdatedContent = null;

        private const string DefaultConcurrencyStamp = "AAAAAAAAAA";
        private const string UpdatedConcurrencyStamp = "BBBBBBBBBB";

        private const FileStatus DefaultStatus = FileStatus.PROCESSING;
        private const FileStatus UpdatedStatus = FileStatus.PROCESSING;

        private readonly AppWebApplicationFactory<TestStartup> _factory;
        private readonly HttpClient _client;
        private readonly IFilePartRepository _filePartRepository;

        private FilePart _filePart;

        private readonly IMapper _mapper;

        private FilePart CreateEntity()
        {
            return new FilePart
            {
                Name = DefaultName,
                Content = DefaultContent,
                ConcurrencyStamp = DefaultConcurrencyStamp,
                Status = DefaultStatus,
            };
        }

        private void InitTest()
        {
            _filePart = CreateEntity();
        }

        [Fact]
        public async Task CreateFilePart()
        {
            var databaseSizeBeforeCreate = await _filePartRepository.CountAsync();

            // Create the FilePart
            FilePartDto _filePartDto = _mapper.Map<FilePartDto>(_filePart);
            var response = await _client.PostAsync("/api/file-parts", TestUtil.ToJsonContent(_filePartDto));
            response.StatusCode.Should().Be(HttpStatusCode.Created);

            // Validate the FilePart in the database
            var filePartList = await _filePartRepository.GetAllAsync();
            filePartList.Count().Should().Be(databaseSizeBeforeCreate + 1);
            var testFilePart = filePartList.Last();
            testFilePart.Name.Should().Be(DefaultName);
            //testFilePart.Content.Should().Be(DefaultContent);
            testFilePart.ConcurrencyStamp.Should().Be(DefaultConcurrencyStamp);
            testFilePart.Status.Should().Be(DefaultStatus);
        }

        [Fact]
        public async Task CreateFilePartWithExistingId()
        {
            var databaseSizeBeforeCreate = await _filePartRepository.CountAsync();
            // Create the FilePart with an existing ID
            _filePart.Id = 1L;

            // An entity with an existing ID cannot be created, so this API call must fail
            FilePartDto _filePartDto = _mapper.Map<FilePartDto>(_filePart);
            var response = await _client.PostAsync("/api/file-parts", TestUtil.ToJsonContent(_filePartDto));

            // Validate the FilePart in the database
            var filePartList = await _filePartRepository.GetAllAsync();
            filePartList.Count().Should().Be(databaseSizeBeforeCreate);
        }

        [Fact]
        public async Task CheckNameIsRequired()
        {
            var databaseSizeBeforeTest = await _filePartRepository.CountAsync();

            // Set the field to null
            _filePart.Name = null;

            // Create the FilePart, which fails.
            FilePartDto _filePartDto = _mapper.Map<FilePartDto>(_filePart);
            var response = await _client.PostAsync("/api/file-parts", TestUtil.ToJsonContent(_filePartDto));
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

            var filePartList = await _filePartRepository.GetAllAsync();
            filePartList.Count().Should().Be(databaseSizeBeforeTest);
        }

        [Fact]
        public async Task GetAllFileParts()
        {
            // Initialize the database
            await _filePartRepository.CreateOrUpdateAsync(_filePart);
            await _filePartRepository.SaveChangesAsync();

            // Get all the filePartList
            var response = await _client.GetAsync("/api/file-parts?sort=id,desc");
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            var json = JToken.Parse(await response.Content.ReadAsStringAsync());
            json.SelectTokens("$.[*].id").Should().Contain(_filePart.Id);
            json.SelectTokens("$.[*].name").Should().Contain(DefaultName);
            json.SelectTokens("$.[*].content").Should().Contain(DefaultContent);
            json.SelectTokens("$.[*].concurrencyStamp").Should().Contain(DefaultConcurrencyStamp);
            json.SelectTokens("$.[*].status").Should().Contain(DefaultStatus.ToString());
        }

        [Fact]
        public async Task GetFilePart()
        {
            // Initialize the database
            await _filePartRepository.CreateOrUpdateAsync(_filePart);
            await _filePartRepository.SaveChangesAsync();

            // Get the filePart
            var response = await _client.GetAsync($"/api/file-parts/{_filePart.Id}");
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            var json = JToken.Parse(await response.Content.ReadAsStringAsync());
            json.SelectTokens("$.id").Should().Contain(_filePart.Id);
            json.SelectTokens("$.name").Should().Contain(DefaultName);
            json.SelectTokens("$.content").Should().Contain(DefaultContent);
            json.SelectTokens("$.concurrencyStamp").Should().Contain(DefaultConcurrencyStamp);
            json.SelectTokens("$.status").Should().Contain(DefaultStatus.ToString());
        }

        [Fact]
        public async Task GetNonExistingFilePart()
        {
            var maxValue = long.MaxValue;
            var response = await _client.GetAsync("/api/file-parts/" + maxValue);
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }

        [Fact]
        public async Task UpdateFilePart()
        {
            // Initialize the database
            await _filePartRepository.CreateOrUpdateAsync(_filePart);
            await _filePartRepository.SaveChangesAsync();
            var databaseSizeBeforeUpdate = await _filePartRepository.CountAsync();

            // Update the filePart
            var updatedFilePart = await _filePartRepository.QueryHelper().GetOneAsync(it => it.Id == _filePart.Id);
            // Disconnect from session so that the updates on updatedFilePart are not directly saved in db
            //TODO detach
            updatedFilePart.Name = UpdatedName;
            updatedFilePart.Content = UpdatedContent;
            updatedFilePart.ConcurrencyStamp = UpdatedConcurrencyStamp;
            updatedFilePart.Status = UpdatedStatus;

            FilePartDto updatedFilePartDto = _mapper.Map<FilePartDto>(updatedFilePart);
            var response = await _client.PutAsync($"/api/file-parts/{_filePart.Id}", TestUtil.ToJsonContent(updatedFilePartDto));
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            // Validate the FilePart in the database
            var filePartList = await _filePartRepository.GetAllAsync();
            filePartList.Count().Should().Be(databaseSizeBeforeUpdate);
            var testFilePart = filePartList.Last();
            testFilePart.Name.Should().Be(UpdatedName);
            //testFilePart.Content.Should().Be(UpdatedContent);
            testFilePart.ConcurrencyStamp.Should().Be(UpdatedConcurrencyStamp);
            testFilePart.Status.Should().Be(UpdatedStatus);
        }

        [Fact]
        public async Task UpdateNonExistingFilePart()
        {
            var databaseSizeBeforeUpdate = await _filePartRepository.CountAsync();

            // If the entity doesn't have an ID, it will throw BadRequestAlertException
            FilePartDto _filePartDto = _mapper.Map<FilePartDto>(_filePart);
            var response = await _client.PutAsync("/api/file-parts/1", TestUtil.ToJsonContent(_filePartDto));
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

            // Validate the FilePart in the database
            var filePartList = await _filePartRepository.GetAllAsync();
            filePartList.Count().Should().Be(databaseSizeBeforeUpdate);
        }

        [Fact]
        public async Task DeleteFilePart()
        {
            // Initialize the database
            await _filePartRepository.CreateOrUpdateAsync(_filePart);
            await _filePartRepository.SaveChangesAsync();
            var databaseSizeBeforeDelete = await _filePartRepository.CountAsync();

            var response = await _client.DeleteAsync($"/api/file-parts/{_filePart.Id}");
            response.StatusCode.Should().Be(HttpStatusCode.NoContent);

            // Validate the database is empty
            var filePartList = await _filePartRepository.GetAllAsync();
            filePartList.Count().Should().Be(databaseSizeBeforeDelete - 1);
        }

        [Fact]
        public void EqualsVerifier()
        {
            TestUtil.EqualsVerifier(typeof(FilePart));
            var filePart1 = new FilePart
            {
                Id = 1L
            };
            var filePart2 = new FilePart
            {
                Id = filePart1.Id
            };
            filePart1.Should().Be(filePart2);
            filePart2.Id = 2L;
            filePart1.Should().NotBe(filePart2);
            filePart1.Id = 0;
            filePart1.Should().NotBe(filePart2);
        }
    }
}
