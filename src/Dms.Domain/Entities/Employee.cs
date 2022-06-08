using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Dms.Domain
{
    [Table("employee")]
    public class Employee : BaseEntity<long>
    {
        [Required]
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime HireDate { get; set; }
        public string Title { get; set; }
        public byte[] Signature { get; set; }
        public string SignatureContentType { get; set; }
        public string UserId { get; set; }
        public User User { get; set; }

        public long? ManagerId { get; set; }
        public Employee Manager { get; set; }

        public long? DepartmentId { get; set; }
        public Department Department { get; set; }

        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

        public override bool Equals(object obj)
        {
            if (this == obj) return true;
            if (obj == null || GetType() != obj.GetType()) return false;
            var employee = obj as Employee;
            if (employee?.Id == null || employee?.Id == 0 || Id == 0) return false;
            return EqualityComparer<long>.Default.Equals(Id, employee.Id);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Id);
        }

        public override string ToString()
        {
            return "Employee{" +
                    $"ID='{Id}'" +
                    $", FirstName='{FirstName}'" +
                    $", LastName='{LastName}'" +
                    $", Email='{Email}'" +
                    $", PhoneNumber='{PhoneNumber}'" +
                    $", HireDate='{HireDate}'" +
                    $", Title='{Title}'" +
                    $", Signature='{Signature}'" +
                    "}";
        }
    }
}
