# Changelog

All notable changes to the `create-storentia` package will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-12-11

### Added
- **API Key Validation**: Automatic validation of Storentia authentication keys before store creation
  - Validates keys against `https://storekit.samarthh.me/v1/auth/key/validate`
  - Retrieves and displays store information after successful validation
  - Shows store name, ID, owner details, key type, and permissions
  - Provides clear error messages for invalid or expired keys
  
- **Enhanced Environment Files**: Environment files now include validated store data
  - Store ID, name, and description from API
  - Store owner information (ID, name, email)
  - API key metadata (type, permissions)
  - Proper API endpoint configuration
  
- **Improved User Experience**:
  - Visual feedback during API validation
  - Detailed store information display after successful authentication
  - Better error handling and user-friendly error messages
  - Network error detection and reporting

- **Documentation**:
  - Added `API_VALIDATION_FEATURE.md` with comprehensive documentation
  - Updated README with API validation information
  - Added this CHANGELOG.md file

### Changed
- Updated `.env.local` structure to include validated store data
- Updated `.env.dashboard` structure to include validated store data
- Updated `.env.example` with all new environment variables
- Changed default API URL to `https://storekit.samarthh.me/v1`

### Security
- API keys are now validated before any store creation begins
- Only valid, active keys can proceed with store setup
- Enhanced security by verifying key permissions and type

## [1.0.3] - 2025-12-10

### Changed
- Improved CLI prompts and user experience
- Enhanced documentation

## [1.0.2] - 2025-12-10

### Fixed
- Fixed package publishing issues
- Improved error handling

## [1.0.1] - 2025-12-10

### Added
- Initial release of `create-storentia`
- Interactive CLI for creating Storentia stores
- Automatic environment file generation
- Git repository cloning and setup
- Dependency installation

### Features
- Store name input (interactive or via argument)
- Authentication key input
- Automatic `.env.local` creation
- Automatic `.env.dashboard` creation
- Automatic `.env.example` creation
- Cleanup of unnecessary template files
- Package.json customization

---

## Version History Summary

- **v1.1.0** (Current): API key validation and enhanced store data
- **v1.0.3**: Documentation improvements
- **v1.0.2**: Bug fixes
- **v1.0.1**: Initial release

## Upgrade Guide

### From v1.0.x to v1.1.0

No breaking changes! The upgrade is seamless:

1. Update the package:
   ```bash
   npm create storentia@latest
   ```

2. The new version will automatically:
   - Validate your API key
   - Retrieve your store data
   - Create enhanced environment files

3. New environment variables available:
   - `NEXT_PUBLIC_STORE_ID`
   - `NEXT_PUBLIC_STORE_DESCRIPTION`
   - `STORE_OWNER_ID`
   - `STORE_OWNER_NAME`
   - `STORE_OWNER_EMAIL`
   - `API_KEY_TYPE`
   - `API_KEY_PERMISSIONS`

## Support

For issues, questions, or feature requests:
- GitHub Issues: https://github.com/thetechsolaceco/Storentia-Init/issues
- Email: support@techsolace.co
