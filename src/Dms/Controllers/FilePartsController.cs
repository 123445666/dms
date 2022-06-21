
using System.Threading;
using System.Collections.Generic;
using System.Threading.Tasks;
using JHipsterNet.Core.Pagination;
using Dms.Domain;
using Dms.Crosscutting.Enums;
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

namespace Dms.Controllers
{
    [Authorize]
    [Route("api/file-parts")]
    [ApiController]
    public class FilePartsController : ControllerBase
    {
        private const string EntityName = "filePart";
        private readonly ILogger<FilePartsController> _log;
        private readonly IMapper _mapper;
        private readonly IFilePartService _filePartService;

        public FilePartsController(ILogger<FilePartsController> log,
        IMapper mapper,
        IFilePartService filePartService)
        {
            _log = log;
            _mapper = mapper;
            _filePartService = filePartService;
        }

        [HttpPost]
        [ValidateModel]
        public async Task<ActionResult<FilePartDto>> CreateFilePart([FromBody] FilePartDto filePartDto)
        {
            _log.LogDebug($"REST request to save FilePart : {filePartDto}");
            if (filePartDto.Id != 0)
                throw new BadRequestAlertException("A new filePart cannot already have an ID", EntityName, "idexists");

            FilePart filePart = _mapper.Map<FilePart>(filePartDto);
            await _filePartService.Save(filePart);
            return CreatedAtAction(nameof(GetFilePart), new { id = filePart.Id }, filePart)
                .WithHeaders(HeaderUtil.CreateEntityCreationAlert(EntityName, filePart.Id.ToString()));
        }

        [HttpPut("{id}")]
        [ValidateModel]
        public async Task<IActionResult> UpdateFilePart(long id, [FromBody] FilePartDto filePartDto)
        {
            _log.LogDebug($"REST request to update FilePart : {filePartDto}");
            if (filePartDto.Id == 0) throw new BadRequestAlertException("Invalid Id", EntityName, "idnull");
            if (id != filePartDto.Id) throw new BadRequestAlertException("Invalid Id", EntityName, "idinvalid");
            FilePart filePart = _mapper.Map<FilePart>(filePartDto);
            await _filePartService.Save(filePart);
            return Ok(filePart)
                .WithHeaders(HeaderUtil.CreateEntityUpdateAlert(EntityName, filePart.Id.ToString()));
        }

        [HttpGet("signfile/{id}")]
        public async Task<IActionResult> SignFilePart(long id)
        {
            _log.LogDebug($"REST request to update FilePartId : {id}");
            if (id == 0) throw new BadRequestAlertException("Invalid Id", EntityName, "idnull");

            var filePart = await _filePartService.FindOne(id);
            filePart.Status = FileStatus.SIGNED;

            await _filePartService.Save(filePart);
            return Ok(filePart)
                .WithHeaders(HeaderUtil.CreateEntityUpdateAlert(EntityName, filePart.Id.ToString()));
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<FilePartDto>>> GetAllFileParts(IPageable pageable)
        {
            _log.LogDebug("REST request to get a page of FileParts");
            var result = await _filePartService.FindAll(pageable);
            var page = new Page<FilePartDto>(result.Content.Select(entity => _mapper.Map<FilePartDto>(entity)).ToList(), pageable, result.TotalElements);
            return Ok(((IPage<FilePartDto>)page).Content).WithHeaders(page.GeneratePaginationHttpHeaders());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetFilePart([FromRoute] long id)
        {
            _log.LogDebug($"REST request to get FilePart : {id}");
            var result = await _filePartService.FindOne(id);
            FilePartDto filePartDto = _mapper.Map<FilePartDto>(result);
            return ActionResultUtil.WrapOrNotFound(filePartDto);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFilePart([FromRoute] long id)
        {
            _log.LogDebug($"REST request to delete FilePart : {id}");
            var filePart = await _filePartService.FindOne(id);
            filePart.Status = FileStatus.DELETED;

            await _filePartService.Save(filePart);
            //await _filePartService.Delete(id);
            return NoContent().WithHeaders(HeaderUtil.CreateEntityDeletionAlert(EntityName, id.ToString()));
        }
    }
}
