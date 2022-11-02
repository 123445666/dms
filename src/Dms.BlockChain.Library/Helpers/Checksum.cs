using System.Security.Cryptography;

namespace Dms.BlockChain.Library.Helpers
{
    public static class Checksum
    {
        public static string CalculateMD5(byte[] document)
        {
            using (var md5 = MD5.Create())
            {
                return BitConverter.ToString(md5.ComputeHash(document)).Replace("-", "").ToLower();
            }
        }
    }
}
