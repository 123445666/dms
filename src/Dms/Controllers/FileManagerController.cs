
using System.Threading;
using System.Collections.Generic;
using System.Threading.Tasks;
using JHipsterNet.Core.Pagination;
using Dms.Domain;
using Dms.Crosscutting.Exceptions;
using Dms.Dto;
using Dms.Web.Extensions;
using Dms.Web.Filters;
using Dms.Web.Rest.Utilities;
using AutoMapper;
using System.Linq;
using Dms.Domain.Repositories.Interfaces;
using Dms.Domain.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using Dms.Crosscutting.Constants;
using Microsoft.AspNetCore.Identity;

namespace Dms.Controllers
{
    [Authorize]
    [Route("api/file-manager")]
    [ApiController]
    public class FileManagerController : ControllerBase
    {
        private const string EntityName = "fileContainer";
        private readonly ILogger<FileManagerController> _log;
        private readonly IMapper _mapper;
        private readonly IFileContainerService _fileContainerService;
        private readonly UserManager<User> _userManager;

        public FileManagerController(ILogger<FileManagerController> log,
        IMapper mapper,
        IFileContainerService fileContainerService,
        UserManager<User> userManager)
        {
            _log = log;
            _mapper = mapper;
            _fileContainerService = fileContainerService;
            _userManager = userManager;
        }

        [HttpPost]
        [ValidateModel]
        public async Task<ActionResult<FileContainerDto>> CreateFileContainer([FromBody] FileContainerDto fileContainerDto)
        {
            _log.LogDebug($"REST request to save FileContainer : {fileContainerDto}");
            if (fileContainerDto.Id != 0)
                throw new BadRequestAlertException("A new fileContainer cannot already have an ID", EntityName, "idexists");

            FileContainer fileContainer = _mapper.Map<FileContainer>(fileContainerDto);
            await _fileContainerService.Save(fileContainer);
            return CreatedAtAction(nameof(GetFileContainer), new { id = fileContainer.Id }, fileContainer)
                .WithHeaders(HeaderUtil.CreateEntityCreationAlert(EntityName, fileContainer.Id.ToString()));
        }

        [HttpPut("{id}")]
        [ValidateModel]
        public async Task<IActionResult> UpdateFileContainer(long id, [FromBody] FileContainerDto fileContainerDto)
        {
            var userName = _userManager.GetUserName(User);
            var user = await _userManager.FindByNameAsync(userName);

            _log.LogDebug($"REST request to update FileContainer : {fileContainerDto}");
            if (fileContainerDto.Id == 0) throw new BadRequestAlertException("Invalid Id", EntityName, "idnull");
            if (id != fileContainerDto.Id) throw new BadRequestAlertException("Invalid Id", EntityName, "idinvalid");
            fileContainerDto.CreatorId = user.Id;
            //fileContainerDto.Creator = user;
            FileContainer fileContainer = _mapper.Map<FileContainer>(fileContainerDto);
            await _fileContainerService.Save(fileContainer);
            return Ok(fileContainer)
                .WithHeaders(HeaderUtil.CreateEntityUpdateAlert(EntityName, fileContainer.Id.ToString()));
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<FileContainerDto>>> GetAllFileContainers(IPageable pageable)
        {
            _log.LogDebug("REST request to get a page of FileContainers");
            var result = await _fileContainerService.FindAll(pageable);
            var page = new Page<FileContainerDto>(result.Content.Select(entity => _mapper.Map<FileContainerDto>(entity)).ToList(), pageable, result.TotalElements);
            return Ok(((IPage<FileContainerDto>)page).Content).WithHeaders(page.GeneratePaginationHttpHeaders());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetFileContainer([FromRoute] long id)
        {
            _log.LogDebug($"REST request to get FileContainer : {id}");
            var result = await _fileContainerService.FindOne(id);
            FileContainerDto fileContainerDto = _mapper.Map<FileContainerDto>(result);
            return ActionResultUtil.WrapOrNotFound(fileContainerDto);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFileContainer([FromRoute] long id)
        {
            _log.LogDebug($"REST request to delete FileContainer : {id}");
            await _fileContainerService.Delete(id);
            return NoContent().WithHeaders(HeaderUtil.CreateEntityDeletionAlert(EntityName, id.ToString()));
        }
    }
}
