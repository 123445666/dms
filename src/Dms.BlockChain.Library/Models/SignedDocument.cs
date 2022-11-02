// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dms.BlockChain.Library.Models
{
    public class SignedDocument
    {
        public string? Checksum { get; set; }
        public string? SignedBy { get; set; }
        public string? SignedUserNameBy { get; set; }
        public string? LastUniqueId { get; set; }
        public DateTime? SignedDate { get; set; }
        public byte[]? SignedData { get; set; }
        public long FileId { get; set; }
    }
}
