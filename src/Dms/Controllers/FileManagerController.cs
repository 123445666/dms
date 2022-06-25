
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
using Dms.Crosscutting.Enums;
using Dms.BlockChain.Library.Models;
using Dms.BlockChain.Library.Helpers;
using Dms.BlockChain.Library;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Hosting;
using System;

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
        private readonly IFilePartService _filePartService;
        private readonly UserManager<User> _userManager;
        private readonly IWebHostEnvironment _webHostEnvironment;
        string webRootPath;
        string contentRootPath;

        public FileManagerController(ILogger<FileManagerController> log,
        IMapper mapper,
        IFileContainerService fileContainerService,
        IFilePartService filePartService,
        UserManager<User> userManager,
        IWebHostEnvironment webHostEnvironment)
        {
            _log = log;
            _mapper = mapper;
            _fileContainerService = fileContainerService;
            _filePartService = filePartService;
            _userManager = userManager;
            _webHostEnvironment = webHostEnvironment;

            webRootPath = _webHostEnvironment.WebRootPath;
            contentRootPath = _webHostEnvironment.ContentRootPath;
        }

        #region FileContainer
        [HttpPost]
        [ValidateModel]
        public async Task<ActionResult<FileContainerDto>> CreateFileContainer([FromBody] FileContainerDto fileContainerDto)
        {
            _log.LogDebug($"REST request to save FileContainer : {fileContainerDto}");


            if (fileContainerDto.Id != 0)
                throw new BadRequestAlertException("A new fileContainer cannot already have an ID", EntityName, "idexists");


            FileContainer fileContainer = _mapper.Map<FileContainer>(fileContainerDto);

            var userName = _userManager.GetUserName(User);
            var user = await _userManager.FindByNameAsync(userName);
            fileContainer.Owner = user;
            fileContainer.OwnerId = user.Id;

            await _fileContainerService.Save(fileContainer);
            return CreatedAtAction(nameof(GetFileContainer), new { id = fileContainer.Id }, fileContainer)
                .WithHeaders(HeaderUtil.CreateEntityCreationAlert(EntityName, fileContainer.Id.ToString()));
        }

        [HttpPut("{id}")]
        [ValidateModel]
        public async Task<IActionResult> UpdateFileContainer(long id, [FromBody] FileContainerDto fileContainerDto)
        {
            _log.LogDebug($"REST request to update FileContainer : {fileContainerDto}");
            if (fileContainerDto.Id == 0) throw new BadRequestAlertException("Invalid Id", EntityName, "idnull");
            if (id != fileContainerDto.Id) throw new BadRequestAlertException("Invalid Id", EntityName, "idinvalid");
            FileContainer fileContainer = _mapper.Map<FileContainer>(fileContainerDto);
            await _fileContainerService.Save(fileContainer);
            return Ok(fileContainer)
                .WithHeaders(HeaderUtil.CreateEntityUpdateAlert(EntityName, fileContainer.Id.ToString()));
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<FileContainerDto>>> GetAllFileContainers(IPageable pageable)
        {
            _log.LogDebug("REST request to get a page of FileContainers");
            var userName = _userManager.GetUserName(User);
            var user = await _userManager.FindByNameAsync(userName);

            IPage<FileContainer> result = null;

            if (User.IsInRole("ROLE_ADMIN"))
            {
                result = await _fileContainerService.FindAll(pageable);
            }
            else
            {
                result = await _fileContainerService.FindAllByUserId(pageable, user.Id);
            }
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
        #endregion

        #region FilePart
        [HttpPost("esign")]
        [ValidateModel]
        public async Task<ActionResult<FilePartDto>> CreateFilePart([FromBody] FilePartDto filePartDto)
        {
            _log.LogDebug($"REST request to save FilePart : {filePartDto}");
            if (filePartDto.Id != 0)
                throw new BadRequestAlertException("A new filePart cannot already have an ID", EntityName, "idexists");

            filePartDto.UniqueId = Guid.NewGuid().ToString();

            FilePart filePart = _mapper.Map<FilePart>(filePartDto);
            await _filePartService.Save(filePart);
            return CreatedAtAction(nameof(GetFilePart), new { id = filePart.Id }, filePart)
                .WithHeaders(HeaderUtil.CreateEntityCreationAlert(EntityName, filePart.Id.ToString()));
        }

        [HttpPut("esign/{id}")]
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

        [HttpGet("esign")]
        public async Task<ActionResult<IEnumerable<FilePartDto>>> GetAllFileParts(IPageable pageable)
        {
            _log.LogDebug("REST request to get a page of FileParts");

            var userName = _userManager.GetUserName(User);
            var user = await _userManager.FindByNameAsync(userName);

            IPage<FilePart> result = null;

            if (User.IsInRole("ROLE_ADMIN"))
            {
                result = await _filePartService.FindAll(pageable);
            }
            else
            {
                result = await _filePartService.FindAllByUserId(pageable, user.Id);
            }

            var page = new Page<FilePartDto>(result.Content.Select(entity => _mapper.Map<FilePartDto>(entity)).ToList(), pageable, result.TotalElements);
            return Ok(((IPage<FilePartDto>)page).Content).WithHeaders(page.GeneratePaginationHttpHeaders());
        }

        [HttpGet("esign/{id}")]
        public async Task<IActionResult> GetFilePart([FromRoute] long id)
        {
            _log.LogDebug($"REST request to get FilePart : {id}");
            var result = await _filePartService.FindOne(id);
            FilePartDto filePartDto = _mapper.Map<FilePartDto>(result);
            return ActionResultUtil.WrapOrNotFound(filePartDto);
        }

        [HttpDelete("esign/{id}")]
        public async Task<IActionResult> DeleteFilePart([FromRoute] long id)
        {
            _log.LogDebug($"REST request to delete FilePart : {id}");
            var filePart = await _filePartService.FindOne(id);
            filePart.Status = FileStatus.DELETED;

            await _filePartService.Save(filePart);
            //await _filePartService.Delete(id);
            return NoContent().WithHeaders(HeaderUtil.CreateEntityDeletionAlert(EntityName, id.ToString()));
        }
        #endregion

        #region SignFile
        [HttpGet("esign/signfile/{id}")]
        public async Task<IActionResult> SignFilePart(long id)
        {
            _log.LogDebug($"REST request to sign FilePartId : {id}");
            if (id == 0) throw new BadRequestAlertException("Invalid Id", EntityName, "idnull");

            var userName = _userManager.GetUserName(User);
            var user = await _userManager.FindByNameAsync(userName);

            var filePart = await _filePartService.FindOne(id);
            filePart.Status = FileStatus.SIGNED;

            SignedDocument document = new SignedDocument()
            {
                Checksum = Checksum.CalculateMD5(filePart.Content),
                SignedBy = user.Id,
                SignedUserNameBy = user.UserName,
                LastUniqueId = filePart.UniqueId,
                SignedDate = DateTime.Now
            };

            //generate new UniqueId
            filePart.UniqueId = Guid.NewGuid().ToString();

            Blockchain bcDocument;

            // if the blockchain exists, load it
            if (System.IO.File.Exists(webRootPath + "/Blockchains/" + filePart.UniqueId + ".bc"))
            {
                string bc = System.IO.File.ReadAllText(webRootPath + "/Blockchains/" + filePart.UniqueId + ".bc");

                bcDocument = JsonConvert.DeserializeObject<Blockchain>(bc);
            }
            else
                bcDocument = new Blockchain(true); // otherwise create a new blockchain

            bcDocument.AddBlock(new Block(DateTime.Now, null, JsonConvert.SerializeObject(document)));

            if (System.IO.Directory.Exists(webRootPath + "/Blockchains/") == false)
                System.IO.Directory.CreateDirectory(webRootPath + "/Blockchains/");

            // store the blockchain as a file
            System.IO.File.WriteAllText(webRootPath + "/Blockchains/" + filePart.UniqueId + ".bc",
                JsonConvert.SerializeObject(bcDocument));

            await _filePartService.Save(filePart);
            return Ok(filePart)
                .WithHeaders(HeaderUtil.CreateEntityUpdateAlert(EntityName, filePart.Id.ToString()));
        }
        [HttpPost("esign/validatefile")]
        public async Task<IActionResult> ValidateFilePart([FromBody] EsignValidate esignValidate)
        {
            _log.LogDebug($"REST request to validate File : {esignValidate.UniqueId}");
            if (esignValidate.DataContent == null || esignValidate.UniqueId == null)
                throw new BadRequestAlertException("Invalid UniqueId", EntityName, "idnull");

            SignedDocument signedDocument = await ValidateFile(esignValidate.DataContent, esignValidate.UniqueId);
            //if (UniqueId == 0) throw new BadRequestAlertException("Invalid UniqueId", EntityName, "idnull");

            //var filePart = await _filePartService.FindOne(id);
            //filePart.Status = FileStatus.RETURNED;

            //await _filePartService.Save(filePart);
            //return Ok(filePart)
            //    .WithHeaders(HeaderUtil.CreateEntityUpdateAlert(EntityName, filePart.Id.ToString()));
            if (signedDocument != null && !string.IsNullOrEmpty(signedDocument.Checksum))
                return Ok(signedDocument)
                    .WithHeaders(HeaderUtil.CreateEntityUpdateAlert(EntityName, signedDocument.Checksum.ToString()));
            return NotFound()
                   .WithHeaders(HeaderUtil.CreateEntityUpdateAlert(EntityName, "novalidate"));
        }

        public async Task<SignedDocument> ValidateFile(byte[] DataContent, string UniqueId)
        {
            if (DataContent == null || UniqueId == null)
                return new SignedDocument();
            // calculate the MD5 of the uploaded document
            string sChecksum = Checksum.CalculateMD5(DataContent);

            Blockchain newDocument;

            // load the associated blockchain
            if (System.IO.File.Exists(webRootPath + "/Blockchains/" + UniqueId + ".bc"))
            {
                string bc = System.IO.File.ReadAllText(webRootPath + "/Blockchains/" + UniqueId + ".bc");

                newDocument = JsonConvert.DeserializeObject<Blockchain>(bc);

                // get the SignedDocument object from the block
                SignedDocument signedDocument =
                    JsonConvert.DeserializeObject<SignedDocument>(newDocument.GetCurrentBlock().Data);

                // compare the checksum in the stored block
                // with the checksum of the uploaded document
                if (signedDocument.Checksum == sChecksum)
                    return signedDocument; // document valid
                else
                    return new SignedDocument();
            }
            else
                return new SignedDocument();
        }
        [HttpGet("esign/unsignfile/{id}")]
        public async Task<IActionResult> UnsignFilePart(long id)
        {
            _log.LogDebug($"REST request to unsign FilePartId : {id}");
            if (id == 0) throw new BadRequestAlertException("Invalid Id", EntityName, "idnull");

            var filePart = await _filePartService.FindOne(id);
            filePart.Status = FileStatus.UNSIGNED;

            await _filePartService.Save(filePart);
            return Ok(filePart)
                .WithHeaders(HeaderUtil.CreateEntityUpdateAlert(EntityName, filePart.Id.ToString()));
        }
        [HttpGet("esign/processfile/{id}")]
        public async Task<IActionResult> ProcessFilePart(long id)
        {
            _log.LogDebug($"REST request to process FilePartId : {id}");
            if (id == 0) throw new BadRequestAlertException("Invalid Id", EntityName, "idnull");

            var filePart = await _filePartService.FindOne(id);
            filePart.Status = FileStatus.PROCESSING;

            await _filePartService.Save(filePart);
            return Ok(filePart)
                .WithHeaders(HeaderUtil.CreateEntityUpdateAlert(EntityName, filePart.Id.ToString()));
        }
        [HttpGet("esign/returnfile/{id}")]
        public async Task<IActionResult> ReturnFilePart(long id)
        {
            _log.LogDebug($"REST request to return FilePartId : {id}");
            if (id == 0) throw new BadRequestAlertException("Invalid Id", EntityName, "idnull");

            var filePart = await _filePartService.FindOne(id);
            filePart.Status = FileStatus.RETURNED;

            await _filePartService.Save(filePart);
            return Ok(filePart)
                .WithHeaders(HeaderUtil.CreateEntityUpdateAlert(EntityName, filePart.Id.ToString()));
        }
        #endregion
    }
}
