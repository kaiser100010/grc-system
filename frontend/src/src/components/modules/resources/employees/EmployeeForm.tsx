// frontend/src/components/modules/resources/employees/EmployeeForm.tsx

import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, AlertCircle } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import { employeeService } from '../../../../services/api/resources';
import type { Employee, CreateEmployeeRequest, UpdateEmployeeRequest } from '../../../../types/resource.types';

interface EmployeeFormProps {
  employee?: Employee | null;
  onClose: () => void;
  onSuccess: () => void;
}

const departments = [
  'IT',
  'Finance',
  'Human Resources',
  'Operations',
  'Sales',
  'Marketing',
  'Legal',
  'Customer Service',
  'Research & Development',
  'Administration'
];

const employeeStatuses = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'on_leave', label: 'On Leave' },
  { value: 'terminated', label: 'Terminated' }
];

const clearanceLevels = [
  { value: 'NONE', label: 'None' },
  { value: 'CONFIDENTIAL', label: 'Confidential' },
  { value: 'SECRET', label: 'Secret' },
  { value: 'TOP_SECRET', label: 'Top Secret' }
];

export const EmployeeForm: React.FC<EmployeeFormProps> = ({ 
  employee, 
  onClose, 
  onSuccess 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [skills, setSkills] = useState<string[]>(employee?.skills || []);
  const [skillInput, setSkillInput] = useState('');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
    reset
  } = useForm<CreateEmployeeRequest>({
    defaultValues: {
      employeeId: employee?.employeeId || '',
      firstName: employee?.firstName || '',
      lastName: employee?.lastName || '',
      email: employee?.email || '',
      phone: employee?.phone || '',
      position: employee?.position || '',
      department: employee?.department || '',
      location: employee?.location || '',
      startDate: employee?.startDate?.split('T')[0] || new Date().toISOString().split('T')[0],
      endDate: employee?.endDate?.split('T')[0] || '',
      managerId: employee?.managerId || '',
      status: employee?.status || 'active',
      skills: employee?.skills || [],
      clearanceLevel: employee?.clearanceLevel || 'NONE',
      notes: employee?.notes || ''
    }
  });

  useEffect(() => {
    setValue('skills', skills);
  }, [skills, setValue]);

  const onSubmit = async (data: CreateEmployeeRequest) => {
    setIsLoading(true);
    
    try {
      if (employee) {
        await employeeService.updateEmployee(employee.id, data as UpdateEmployeeRequest);
        toast.success('Employee updated successfully!');
      } else {
        await employeeService.createEmployee(data);
        toast.success('Employee created successfully!');
      }
      
      onSuccess();
      onClose();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'An error occurred while saving the employee';
      toast.error(errorMessage);
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSkill = () => {
    const trimmedSkill = skillInput.trim();
    if (trimmedSkill && !skills.includes(trimmedSkill)) {
      const newSkills = [...skills, trimmedSkill];
      setSkills(newSkills);
      setSkillInput('');
      toast.success(`Added skill: ${trimmedSkill}`);
    } else if (skills.includes(trimmedSkill)) {
      toast.error('This skill already exists');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
    toast.success(`Removed skill: ${skill}`);
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">
            {employee ? 'Edit Employee' : 'New Employee'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-2 gap-4">
            {/* Employee ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employee ID *
              </label>
              <input
                {...register('employeeId', { 
                  required: 'Employee ID is required',
                  pattern: {
                    value: /^[A-Z0-9]{3,}$/,
                    message: 'Employee ID must be at least 3 characters (letters and numbers)'
                  }
                })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.employeeId ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isLoading || !!employee}
                placeholder="EMP001"
                style={{ textTransform: 'uppercase' }}
              />
              {errors.employeeId && (
                <p className="mt-1 text-sm text-red-600">{errors.employeeId.message}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                {...register('status')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              >
                {employeeStatuses.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                {...register('firstName', { 
                  required: 'First name is required',
                  minLength: {
                    value: 2,
                    message: 'First name must be at least 2 characters'
                  }
                })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.firstName ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isLoading}
                placeholder="John"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                {...register('lastName', { 
                  required: 'Last name is required',
                  minLength: {
                    value: 2,
                    message: 'Last name must be at least 2 characters'
                  }
                })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.lastName ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isLoading}
                placeholder="Doe"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                type="email"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isLoading}
                placeholder="john.doe@company.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                {...register('phone', {
                  pattern: {
                    value: /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/,
                    message: 'Invalid phone number'
                  }
                })}
                type="tel"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isLoading}
                placeholder="+1 (555) 123-4567"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            {/* Position */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position *
              </label>
              <input
                {...register('position', { 
                  required: 'Position is required',
                  minLength: {
                    value: 2,
                    message: 'Position must be at least 2 characters'
                  }
                })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.position ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isLoading}
                placeholder="Senior Developer"
              />
              {errors.position && (
                <p className="mt-1 text-sm text-red-600">{errors.position.message}</p>
              )}
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department *
              </label>
              <select
                {...register('department', { required: 'Department is required' })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.department ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isLoading}
              >
                <option value="">Select department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              {errors.department && (
                <p className="mt-1 text-sm text-red-600">{errors.department.message}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location *
              </label>
              <input
                {...register('location', { 
                  required: 'Location is required',
                  minLength: {
                    value: 2,
                    message: 'Location must be at least 2 characters'
                  }
                })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.location ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isLoading}
                placeholder="New York, USA"
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
              )}
            </div>

            {/* Manager ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Manager ID
              </label>
              <input
                {...register('managerId')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
                placeholder="Manager's Employee ID"
              />
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date *
              </label>
              <input
                {...register('startDate', { 
                  required: 'Start date is required',
                  validate: (value) => {
                    const date = new Date(value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const futureLimit = new Date();
                    futureLimit.setMonth(futureLimit.getMonth() + 3);
                    
                    if (date > futureLimit) {
                      return 'Start date cannot be more than 3 months in the future';
                    }
                    return true;
                  }
                })}
                type="date"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.startDate ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isLoading}
              />
              {errors.startDate && (
                <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
              )}
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                {...register('endDate', {
                  validate: (value) => {
                    if (value) {
                      const startDate = watch('startDate');
                      if (new Date(value) < new Date(startDate)) {
                        return 'End date must be after start date';
                      }
                    }
                    return true;
                  }
                })}
                type="date"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.endDate ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isLoading}
              />
              {errors.endDate && (
                <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
              )}
            </div>

            {/* Clearance Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Clearance Level
              </label>
              <select
                {...register('clearanceLevel')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              >
                {clearanceLevels.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Skills */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skills
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add a skill and press Enter"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                disabled={isLoading || !skillInput.trim()}
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map(skill => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1 group"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="ml-1 hover:text-blue-900 opacity-60 group-hover:opacity-100 transition-opacity"
                    disabled={isLoading}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              {...register('notes', {
                maxLength: {
                  value: 500,
                  message: 'Notes cannot exceed 500 characters'
                }
              })}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.notes ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isLoading}
              placeholder="Additional notes about the employee..."
            />
            <div className="flex justify-between items-center mt-1">
              {errors.notes && (
                <p className="text-sm text-red-600">{errors.notes.message}</p>
              )}
              <p className="text-sm text-gray-500 ml-auto">
                {watch('notes')?.length || 0}/500
              </p>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex justify-between items-center">
          <p className="text-sm text-gray-500">
            * Required fields
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {employee ? 'Update' : 'Create'} Employee
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};