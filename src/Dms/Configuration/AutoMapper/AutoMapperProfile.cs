
using AutoMapper;
using System.Linq;
using Dms.Domain;
using Dms.Dto;


namespace Dms.Configuration.AutoMapper
{

    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<User, UserDto>()
                .ForMember(userDto => userDto.Roles, opt => opt.MapFrom(user => user.UserRoles.Select(iur => iur.Role.Name).ToHashSet()))
            .ReverseMap()
                .ForPath(user => user.UserRoles, opt => opt.MapFrom(userDto => userDto.Roles.Select(role => new UserRole { Role = new Role { Id = role, Name = role }, RoleId = role, UserId = userDto.Id }).ToHashSet())); ;

            CreateMap<Region, RegionDto>().ReverseMap();
            CreateMap<Country, CountryDto>().ReverseMap();
            CreateMap<Location, LocationDto>().ReverseMap();
            CreateMap<Department, DepartmentDto>().ReverseMap();
            CreateMap<Employee, EmployeeDto>().ReverseMap();
            CreateMap<FileContainer, FileContainerDto>().ReverseMap();
            CreateMap<FilePart, FilePartDto>().ReverseMap();
        }
    }
}
