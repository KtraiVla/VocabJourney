using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace IdentityService.Services
{
    public class TokenGenerator
    {
        private readonly IConfiguration _config; 
        public TokenGenerator(IConfiguration config)
        {
            _config = config;
        }
        public string GenerateToken(Guid userId, string email, string role)
        {

        }
    }
}

