using System;

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
    public class EmployeesControllerIntTest
    {
        public EmployeesControllerIntTest()
        {
            _factory = new AppWebApplicationFactory<TestStartup>().WithMockUser();
            _client = _factory.CreateClient();

            _employeeRepository = _factory.GetRequiredService<IEmployeeRepository>();

            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile(new AutoMapperProfile());
            });
            _mapper = config.CreateMapper();

            InitTest();
        }

        private const string DefaultFirstName = "AAAAAAAAAA";
        private const string UpdatedFirstName = "BBBBBBBBBB";

        private const string DefaultLastName = "AAAAAAAAAA";
        private const string UpdatedLastName = "BBBBBBBBBB";

        private const string DefaultEmail = "AAAAAAAAAA";
        private const string UpdatedEmail = "BBBBBBBBBB";

        private const string DefaultPhoneNumber = "AAAAAAAAAA";
        private const string UpdatedPhoneNumber = "BBBBBBBBBB";

        private static readonly DateTime DefaultHireDate = DateTime.UnixEpoch;
        private static readonly DateTime UpdatedHireDate = DateTime.Now;

        private const string DefaultTitle = "AAAAAAAAAA";
        private const string UpdatedTitle = "BBBBBBBBBB";

        private static readonly byte[] DefaultSignature = null;
        private static readonly byte[] UpdatedSignature = null;

        private readonly AppWebApplicationFactory<TestStartup> _factory;
        private readonly HttpClient _client;
        private readonly IEmployeeRepository _employeeRepository;

        private Employee _employee;

        private readonly IMapper _mapper;

        private Employee CreateEntity()
        {
            return new Employee
            {
                FirstName = DefaultFirstName,
                LastName = DefaultLastName,
                Email = DefaultEmail,
                PhoneNumber = DefaultPhoneNumber,
                HireDate = DefaultHireDate,
                Title = DefaultTitle,
                Signature = DefaultSignature,
            };
        }

        private void InitTest()
        {
            _employee = CreateEntity();
        }

        [Fact]
        public async Task CreateEmployee()
        {
            var databaseSizeBeforeCreate = await _employeeRepository.CountAsync();

            // Create the Employee
            EmployeeDto _employeeDto = _mapper.Map<EmployeeDto>(_employee);
            var response = await _client.PostAsync("/api/employees", TestUtil.ToJsonContent(_employeeDto));
            response.StatusCode.Should().Be(HttpStatusCode.Created);

            // Validate the Employee in the database
            var employeeList = await _employeeRepository.GetAllAsync();
            employeeList.Count().Should().Be(databaseSizeBeforeCreate + 1);
            var testEmployee = employeeList.Last();
            testEmployee.FirstName.Should().Be(DefaultFirstName);
            testEmployee.LastName.Should().Be(DefaultLastName);
            testEmployee.Email.Should().Be(DefaultEmail);
            testEmployee.PhoneNumber.Should().Be(DefaultPhoneNumber);
            testEmployee.HireDate.Should().Be(DefaultHireDate);
            testEmployee.Title.Should().Be(DefaultTitle);
            //testEmployee.Signature.Should().Be(DefaultSignature);
        }

        [Fact]
        public async Task CreateEmployeeWithExistingId()
        {
            var databaseSizeBeforeCreate = await _employeeRepository.CountAsync();
            // Create the Employee with an existing ID
            _employee.Id = 1L;

            // An entity with an existing ID cannot be created, so this API call must fail
            EmployeeDto _employeeDto = _mapper.Map<EmployeeDto>(_employee);
            var response = await _client.PostAsync("/api/employees", TestUtil.ToJsonContent(_employeeDto));

            // Validate the Employee in the database
            var employeeList = await _employeeRepository.GetAllAsync();
            employeeList.Count().Should().Be(databaseSizeBeforeCreate);
        }

        [Fact]
        public async Task CheckFirstNameIsRequired()
        {
            var databaseSizeBeforeTest = await _employeeRepository.CountAsync();

            // Set the field to null
            _employee.FirstName = null;

            // Create the Employee, which fails.
            EmployeeDto _employeeDto = _mapper.Map<EmployeeDto>(_employee);
            var response = await _client.PostAsync("/api/employees", TestUtil.ToJsonContent(_employeeDto));
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

            var employeeList = await _employeeRepository.GetAllAsync();
            employeeList.Count().Should().Be(databaseSizeBeforeTest);
        }

        [Fact]
        public async Task GetAllEmployees()
        {
            // Initialize the database
            await _employeeRepository.CreateOrUpdateAsync(_employee);
            await _employeeRepository.SaveChangesAsync();

            // Get all the employeeList
            var response = await _client.GetAsync("/api/employees?sort=id,desc");
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            var json = JToken.Parse(await response.Content.ReadAsStringAsync());
            json.SelectTokens("$.[*].id").Should().Contain(_employee.Id);
            json.SelectTokens("$.[*].firstName").Should().Contain(DefaultFirstName);
            json.SelectTokens("$.[*].lastName").Should().Contain(DefaultLastName);
            json.SelectTokens("$.[*].email").Should().Contain(DefaultEmail);
            json.SelectTokens("$.[*].phoneNumber").Should().Contain(DefaultPhoneNumber);
            json.SelectTokens("$.[*].hireDate").Should().Contain(DefaultHireDate);
            json.SelectTokens("$.[*].title").Should().Contain(DefaultTitle);
            json.SelectTokens("$.[*].signature").Should().Contain(DefaultSignature);
        }

        [Fact]
        public async Task GetEmployee()
        {
            // Initialize the database
            await _employeeRepository.CreateOrUpdateAsync(_employee);
            await _employeeRepository.SaveChangesAsync();

            // Get the employee
            var response = await _client.GetAsync($"/api/employees/{_employee.Id}");
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            var json = JToken.Parse(await response.Content.ReadAsStringAsync());
            json.SelectTokens("$.id").Should().Contain(_employee.Id);
            json.SelectTokens("$.firstName").Should().Contain(DefaultFirstName);
            json.SelectTokens("$.lastName").Should().Contain(DefaultLastName);
            json.SelectTokens("$.email").Should().Contain(DefaultEmail);
            json.SelectTokens("$.phoneNumber").Should().Contain(DefaultPhoneNumber);
            json.SelectTokens("$.hireDate").Should().Contain(DefaultHireDate);
            json.SelectTokens("$.title").Should().Contain(DefaultTitle);
            json.SelectTokens("$.signature").Should().Contain(DefaultSignature);
        }

        [Fact]
        public async Task GetNonExistingEmployee()
        {
            var maxValue = long.MaxValue;
            var response = await _client.GetAsync("/api/employees/" + maxValue);
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }

        [Fact]
        public async Task UpdateEmployee()
        {
            // Initialize the database
            await _employeeRepository.CreateOrUpdateAsync(_employee);
            await _employeeRepository.SaveChangesAsync();
            var databaseSizeBeforeUpdate = await _employeeRepository.CountAsync();

            // Update the employee
            var updatedEmployee = await _employeeRepository.QueryHelper().GetOneAsync(it => it.Id == _employee.Id);
            // Disconnect from session so that the updates on updatedEmployee are not directly saved in db
            //TODO detach
            updatedEmployee.FirstName = UpdatedFirstName;
            updatedEmployee.LastName = UpdatedLastName;
            updatedEmployee.Email = UpdatedEmail;
            updatedEmployee.PhoneNumber = UpdatedPhoneNumber;
            updatedEmployee.HireDate = UpdatedHireDate;
            updatedEmployee.Title = UpdatedTitle;
            updatedEmployee.Signature = UpdatedSignature;

            EmployeeDto updatedEmployeeDto = _mapper.Map<EmployeeDto>(updatedEmployee);
            var response = await _client.PutAsync($"/api/employees/{_employee.Id}", TestUtil.ToJsonContent(updatedEmployeeDto));
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            // Validate the Employee in the database
            var employeeList = await _employeeRepository.GetAllAsync();
            employeeList.Count().Should().Be(databaseSizeBeforeUpdate);
            var testEmployee = employeeList.Last();
            testEmployee.FirstName.Should().Be(UpdatedFirstName);
            testEmployee.LastName.Should().Be(UpdatedLastName);
            testEmployee.Email.Should().Be(UpdatedEmail);
            testEmployee.PhoneNumber.Should().Be(UpdatedPhoneNumber);
            testEmployee.HireDate.Should().BeCloseTo(UpdatedHireDate);
            testEmployee.Title.Should().Be(UpdatedTitle);
            //testEmployee.Signature.Should().Be(UpdatedSignature);
        }

        [Fact]
        public async Task UpdateNonExistingEmployee()
        {
            var databaseSizeBeforeUpdate = await _employeeRepository.CountAsync();

            // If the entity doesn't have an ID, it will throw BadRequestAlertException
            EmployeeDto _employeeDto = _mapper.Map<EmployeeDto>(_employee);
            var response = await _client.PutAsync("/api/employees/1", TestUtil.ToJsonContent(_employeeDto));
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

            // Validate the Employee in the database
            var employeeList = await _employeeRepository.GetAllAsync();
            employeeList.Count().Should().Be(databaseSizeBeforeUpdate);
        }

        [Fact]
        public async Task DeleteEmployee()
        {
            // Initialize the database
            await _employeeRepository.CreateOrUpdateAsync(_employee);
            await _employeeRepository.SaveChangesAsync();
            var databaseSizeBeforeDelete = await _employeeRepository.CountAsync();

            var response = await _client.DeleteAsync($"/api/employees/{_employee.Id}");
            response.StatusCode.Should().Be(HttpStatusCode.NoContent);

            // Validate the database is empty
            var employeeList = await _employeeRepository.GetAllAsync();
            employeeList.Count().Should().Be(databaseSizeBeforeDelete - 1);
        }

        [Fact]
        public void EqualsVerifier()
        {
            TestUtil.EqualsVerifier(typeof(Employee));
            var employee1 = new Employee
            {
                Id = 1L
            };
            var employee2 = new Employee
            {
                Id = employee1.Id
            };
            employee1.Should().Be(employee2);
            employee2.Id = 2L;
            employee1.Should().NotBe(employee2);
            employee1.Id = 0;
            employee1.Should().NotBe(employee2);
        }
    }
}
