# User Management Enhancement TODO

## Overview
Enhance the existing user management system to better support creating and managing trainer and trainee accounts with role-specific features, filtering, and pagination.

## Tasks

### 1. Backend Enhancements
- [x] Add role filtering to UserViewSet in `training/views.py`
- [x] Add optional trainer expertise field to User model in `training/models.py`
- [x] Add optional trainee designation field to User model in `training/models.py`
- [x] Update UserSerializer in `training/serializers.py` to include new fields
- [x] Run migrations for any model changes

### 2. API Service Updates
- [x] Extend usersAPI in `frontend/src/services/api.js` to support role filtering
- [x] Add query parameter support for role-based fetching

### 3. Frontend UI Enhancements
- [x] Add role-based filtering tabs/dropdown in Users.js component
- [x] Implement pagination navigation in Users.js
- [x] Add trainee designation assignment in create/edit forms
- [x] Add trainer expertise fields in create/edit forms
- [x] Update form validation for role-specific fields

### 4. Testing and Verification
- [ ] Test CRUD operations for trainer/trainee creation
- [ ] Verify role filtering works correctly
- [ ] Test pagination functionality
- [ ] Check permission restrictions (admin-only management)

### 5. Integration Updates
- [ ] Update SuperAdminDashboard to link to enhanced user management
- [ ] Ensure AuthContext handles role-based access properly
