
using AutoMapper;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using FluentAssertions;
using Dms.Infrastructure.Data;
using Dms.Domain;
using Dms.Domain.Repositories.Interfaces;
using Dms.Dto;
using Dms.Configuration.AutoMapper;
using Dms.Test.Setup;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using Xunit;

namespace Dms.Test.Controllers
{
    public class FileContainersControllerIntTest
    {
        public FileContainersControllerIntTest()
        {
            _factory = new AppWebApplicationFactory<TestStartup>().WithMockUser();
            _client = _factory.CreateClient();

            _fileContainerRepository = _factory.GetRequiredService<IFileContainerRepository>();

            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile(new AutoMapperProfile());
            });
            _mapper = config.CreateMapper();

            InitTest();
        }

        private const string DefaultName = "AAAAAAAAAA";
        private const string UpdatedName = "BBBBBBBBBB";

        private const string DefaultConcurrencyStamp = "AAAAAAAAAA";
        private const string UpdatedConcurrencyStamp = "BBBBBBBBBB";

        private readonly AppWebApplicationFactory<TestStartup> _factory;
        private readonly HttpClient _client;
        private readonly IFileContainerRepository _fileContainerRepository;

        private FileContainer _fileContainer;

        private readonly IMapper _mapper;

        private FileContainer CreateEntity()
        {
            return new FileContainer
            {
                Name = DefaultName,
                ConcurrencyStamp = DefaultConcurrencyStamp,
            };
        }

        private void InitTest()
        {
            _fileContainer = CreateEntity();
        }

        [Fact]
        public async Task CreateFileContainer()
        {
            var databaseSizeBeforeCreate = await _fileContainerRepository.CountAsync();

            // Create the FileContainer
            FileContainerDto _fileContainerDto = _mapper.Map<FileContainerDto>(_fileContainer);
            var response = await _client.PostAsync("/api/file-containers", TestUtil.ToJsonContent(_fileContainerDto));
            response.StatusCode.Should().Be(HttpStatusCode.Created);

            // Validate the FileContainer in the database
            var fileContainerList = await _fileContainerRepository.GetAllAsync();
            fileContainerList.Count().Should().Be(databaseSizeBeforeCreate + 1);
            var testFileContainer = fileContainerList.Last();
            testFileContainer.Name.Should().Be(DefaultName);
            testFileContainer.ConcurrencyStamp.Should().Be(DefaultConcurrencyStamp);
        }

        [Fact]
        public async Task CreateFileContainerWithExistingId()
        {
            var databaseSizeBeforeCreate = await _fileContainerRepository.CountAsync();
            // Create the FileContainer with an existing ID
            _fileContainer.Id = 1L;

            // An entity with an existing ID cannot be created, so this API call must fail
            FileContainerDto _fileContainerDto = _mapper.Map<FileContainerDto>(_fileContainer);
            var response = await _client.PostAsync("/api/file-containers", TestUtil.ToJsonContent(_fileContainerDto));

            // Validate the FileContainer in the database
            var fileContainerList = await _fileContainerRepository.GetAllAsync();
            fileContainerList.Count().Should().Be(databaseSizeBeforeCreate);
        }

        [Fact]
        public async Task GetAllFileContainers()
        {
            // Initialize the database
            await _fileContainerRepository.CreateOrUpdateAsync(_fileContainer);
            await _fileContainerRepository.SaveChangesAsync();

            // Get all the fileContainerList
            var response = await _client.GetAsync("/api/file-containers?sort=id,desc");
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            var json = JToken.Parse(await response.Content.ReadAsStringAsync());
            json.SelectTokens("$.[*].id").Should().Contain(_fileContainer.Id);
            json.SelectTokens("$.[*].name").Should().Contain(DefaultName);
            json.SelectTokens("$.[*].concurrencyStamp").Should().Contain(DefaultConcurrencyStamp);
        }

        [Fact]
        public async Task GetFileContainer()
        {
            // Initialize the database
            await _fileContainerRepository.CreateOrUpdateAsync(_fileContainer);
            await _fileContainerRepository.SaveChangesAsync();

            // Get the fileContainer
            var response = await _client.GetAsync($"/api/file-containers/{_fileContainer.Id}");
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            var json = JToken.Parse(await response.Content.ReadAsStringAsync());
            json.SelectTokens("$.id").Should().Contain(_fileContainer.Id);
            json.SelectTokens("$.name").Should().Contain(DefaultName);
            json.SelectTokens("$.concurrencyStamp").Should().Contain(DefaultConcurrencyStamp);
        }

        [Fact]
        public async Task GetNonExistingFileContainer()
        {
            var maxValue = long.MaxValue;
            var response = await _client.GetAsync("/api/file-containers/" + maxValue);
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }

        [Fact]
        public async Task UpdateFileContainer()
        {
            // Initialize the database
            await _fileContainerRepository.CreateOrUpdateAsync(_fileContainer);
            await _fileContainerRepository.SaveChangesAsync();
            var databaseSizeBeforeUpdate = await _fileContainerRepository.CountAsync();

            // Update the fileContainer
            var updatedFileContainer = await _fileContainerRepository.QueryHelper().GetOneAsync(it => it.Id == _fileContainer.Id);
            // Disconnect from session so that the updates on updatedFileContainer are not directly saved in db
            //TODO detach
            updatedFileContainer.Name = UpdatedName;
            updatedFileContainer.ConcurrencyStamp = UpdatedConcurrencyStamp;

            FileContainerDto updatedFileContainerDto = _mapper.Map<FileContainerDto>(updatedFileContainer);
            var response = await _client.PutAsync($"/api/file-containers/{_fileContainer.Id}", TestUtil.ToJsonContent(updatedFileContainerDto));
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            // Validate the FileContainer in the database
            var fileContainerList = await _fileContainerRepository.GetAllAsync();
            fileContainerList.Count().Should().Be(databaseSizeBeforeUpdate);
            var testFileContainer = fileContainerList.Last();
            testFileContainer.Name.Should().Be(UpdatedName);
            testFileContainer.ConcurrencyStamp.Should().Be(UpdatedConcurrencyStamp);
        }

        [Fact]
        public async Task UpdateNonExistingFileContainer()
        {
            var databaseSizeBeforeUpdate = await _fileContainerRepository.CountAsync();

            // If the entity doesn't have an ID, it will throw BadRequestAlertException
            FileContainerDto _fileContainerDto = _mapper.Map<FileContainerDto>(_fileContainer);
            var response = await _client.PutAsync("/api/file-containers/1", TestUtil.ToJsonContent(_fileContainerDto));
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

            // Validate the FileContainer in the database
            var fileContainerList = await _fileContainerRepository.GetAllAsync();
            fileContainerList.Count().Should().Be(databaseSizeBeforeUpdate);
        }

        [Fact]
        public async Task DeleteFileContainer()
        {
            // Initialize the database
            await _fileContainerRepository.CreateOrUpdateAsync(_fileContainer);
            await _fileContainerRepository.SaveChangesAsync();
            var databaseSizeBeforeDelete = await _fileContainerRepository.CountAsync();

            var response = await _client.DeleteAsync($"/api/file-containers/{_fileContainer.Id}");
            response.StatusCode.Should().Be(HttpStatusCode.NoContent);

            // Validate the database is empty
            var fileContainerList = await _fileContainerRepository.GetAllAsync();
            fileContainerList.Count().Should().Be(databaseSizeBeforeDelete - 1);
        }

        [Fact]
        public void EqualsVerifier()
        {
            TestUtil.EqualsVerifier(typeof(FileContainer));
            var fileContainer1 = new FileContainer
            {
                Id = 1L
            };
            var fileContainer2 = new FileContainer
            {
                Id = fileContainer1.Id
            };
            fileContainer1.Should().Be(fileContainer2);
            fileContainer2.Id = 2L;
            fileContainer1.Should().NotBe(fileContainer2);
            fileContainer1.Id = 0;
            fileContainer1.Should().NotBe(fileContainer2);
        }
    }
}
