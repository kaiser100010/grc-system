/*
  Warnings:

  - You are about to drop the column `classification` on the `assets` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `assets` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `assets` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `assets` table. All the data in the column will be lost.
  - You are about to drop the column `organization_id` on the `assets` table. All the data in the column will be lost.
  - You are about to drop the column `owner_id` on the `assets` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `assets` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `entity_id` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `entity_type` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `new_values` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `old_values` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `controls` table. All the data in the column will be lost.
  - You are about to drop the column `control_id` on the `controls` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `controls` table. All the data in the column will be lost.
  - You are about to drop the column `framework_id` on the `controls` table. All the data in the column will be lost.
  - You are about to drop the column `implementation_status` on the `controls` table. All the data in the column will be lost.
  - You are about to drop the column `organization_id` on the `controls` table. All the data in the column will be lost.
  - You are about to drop the column `responsible_id` on the `controls` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `controls` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `employees` table. All the data in the column will be lost.
  - You are about to drop the column `employee_id` on the `employees` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `employees` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `employees` table. All the data in the column will be lost.
  - You are about to drop the column `organization_id` on the `employees` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `employees` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `employees` table. All the data in the column will be lost.
  - The `status` column on the `employees` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `assigned_to_id` on the `incidents` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `incidents` table. All the data in the column will be lost.
  - You are about to drop the column `detected_at` on the `incidents` table. All the data in the column will be lost.
  - You are about to drop the column `impact_details` on the `incidents` table. All the data in the column will be lost.
  - You are about to drop the column `occurred_at` on the `incidents` table. All the data in the column will be lost.
  - You are about to drop the column `organization_id` on the `incidents` table. All the data in the column will be lost.
  - You are about to drop the column `reporter_id` on the `incidents` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `incidents` table. All the data in the column will be lost.
  - The `status` column on the `incidents` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `approved_by_id` on the `policies` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `policies` table. All the data in the column will be lost.
  - You are about to drop the column `effective_date` on the `policies` table. All the data in the column will be lost.
  - You are about to drop the column `organization_id` on the `policies` table. All the data in the column will be lost.
  - You are about to drop the column `owner_id` on the `policies` table. All the data in the column will be lost.
  - You are about to drop the column `review_date` on the `policies` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `policies` table. All the data in the column will be lost.
  - The `status` column on the `policies` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `created_at` on the `risks` table. All the data in the column will be lost.
  - You are about to drop the column `custom_fields` on the `risks` table. All the data in the column will be lost.
  - You are about to drop the column `organization_id` on the `risks` table. All the data in the column will be lost.
  - You are about to drop the column `owner_id` on the `risks` table. All the data in the column will be lost.
  - You are about to drop the column `probability` on the `risks` table. All the data in the column will be lost.
  - You are about to drop the column `risk_score` on the `risks` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `risks` table. All the data in the column will be lost.
  - The `status` column on the `risks` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `created_at` on the `systems` table. All the data in the column will be lost.
  - You are about to drop the column `data_location` on the `systems` table. All the data in the column will be lost.
  - You are about to drop the column `organization_id` on the `systems` table. All the data in the column will be lost.
  - You are about to drop the column `responsible_id` on the `systems` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `systems` table. All the data in the column will be lost.
  - You are about to drop the column `vendor_id` on the `systems` table. All the data in the column will be lost.
  - The `criticality` column on the `systems` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `assigned_to_id` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `created_by_id` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `due_date` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `organization_id` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `tasks` table. All the data in the column will be lost.
  - The `status` column on the `tasks` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `priority` column on the `tasks` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `created_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `last_login` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `organization_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `password_hash` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `users` table. All the data in the column will be lost.
  - The `role` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `contact_email` on the `vendors` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `vendors` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `vendors` table. All the data in the column will be lost.
  - You are about to drop the column `organization_id` on the `vendors` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `vendors` table. All the data in the column will be lost.
  - You are about to drop the column `risk_level` on the `vendors` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `vendors` table. All the data in the column will be lost.
  - You are about to drop the `control_evidences` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `evidences` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `frameworks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `incident_actions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `organizations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `risk_assessments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `risk_treatments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `task_comments` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `employees` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[employeeId]` on the table `employees` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `owner` to the `assets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `assets` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `assets` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `resource` to the `audit_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resourceId` to the `audit_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `controlType` to the `controls` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdBy` to the `controls` table without a default value. This is not possible if the table is not empty.
  - Added the required column `framework` to the `controls` table without a default value. This is not possible if the table is not empty.
  - Added the required column `frequency` to the `controls` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `controls` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdBy` to the `employees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employeeId` to the `employees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `employees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `employees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `employees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `position` to the `employees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `employees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `employees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedBy` to the `employees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `department` to the `employees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `incidents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdBy` to the `incidents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `incidents` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `severity` on the `incidents` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `content` to the `policies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdBy` to the `policies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `policies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdBy` to the `risks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `likelihood` to the `risks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `riskLevel` to the `risks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `risks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `risks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `owner` to the `systems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `systems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdBy` to the `tasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `tasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contactEmail` to the `vendors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `vendors` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'MANAGER', 'USER', 'AUDITOR');

-- CreateEnum
CREATE TYPE "EmployeeStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ON_LEAVE', 'TERMINATED');

-- CreateEnum
CREATE TYPE "Department" AS ENUM ('IT', 'HR', 'FINANCE', 'OPERATIONS', 'LEGAL', 'SECURITY', 'COMPLIANCE');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'OVERDUE');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "RiskCategory" AS ENUM ('OPERATIONAL', 'FINANCIAL', 'STRATEGIC', 'COMPLIANCE', 'TECHNOLOGY', 'REPUTATIONAL');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('VERY_LOW', 'LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH');

-- CreateEnum
CREATE TYPE "RiskStatus" AS ENUM ('IDENTIFIED', 'ASSESSED', 'MITIGATED', 'MONITORED', 'CLOSED');

-- CreateEnum
CREATE TYPE "ControlType" AS ENUM ('PREVENTIVE', 'DETECTIVE', 'CORRECTIVE', 'COMPENSATING');

-- CreateEnum
CREATE TYPE "Framework" AS ENUM ('SOX', 'COSO', 'ISO27001', 'NIST', 'COBIT', 'CUSTOM');

-- CreateEnum
CREATE TYPE "Frequency" AS ENUM ('CONTINUOUS', 'DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'ANNUALLY', 'AD_HOC');

-- CreateEnum
CREATE TYPE "ControlStatus" AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE', 'RETIRED');

-- CreateEnum
CREATE TYPE "ControlEffectiveness" AS ENUM ('NOT_TESTED', 'EFFECTIVE', 'PARTIALLY_EFFECTIVE', 'INEFFECTIVE');

-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "IncidentStatus" AS ENUM ('REPORTED', 'INVESTIGATING', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "IncidentCategory" AS ENUM ('SECURITY', 'OPERATIONAL', 'COMPLIANCE', 'DATA_BREACH', 'SYSTEM_FAILURE', 'OTHER');

-- CreateEnum
CREATE TYPE "PolicyStatus" AS ENUM ('DRAFT', 'REVIEW', 'APPROVED', 'EFFECTIVE', 'RETIRED');

-- CreateEnum
CREATE TYPE "EvidenceCategory" AS ENUM ('CONTROL_TESTING', 'POLICY_DOCUMENTATION', 'AUDIT_REPORT', 'SCREENSHOT', 'OTHER');

-- CreateEnum
CREATE TYPE "VendorStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING');

-- CreateEnum
CREATE TYPE "SystemStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'MAINTENANCE', 'DEPRECATED');

-- CreateEnum
CREATE TYPE "AssetType" AS ENUM ('HARDWARE', 'SOFTWARE', 'DATA', 'FACILITY');

-- CreateEnum
CREATE TYPE "AssetStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'DISPOSED');

-- DropForeignKey
ALTER TABLE "assets" DROP CONSTRAINT "assets_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "assets" DROP CONSTRAINT "assets_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "audit_logs" DROP CONSTRAINT "audit_logs_user_id_fkey";

-- DropForeignKey
ALTER TABLE "control_evidences" DROP CONSTRAINT "control_evidences_control_id_fkey";

-- DropForeignKey
ALTER TABLE "control_evidences" DROP CONSTRAINT "control_evidences_evidence_id_fkey";

-- DropForeignKey
ALTER TABLE "controls" DROP CONSTRAINT "controls_framework_id_fkey";

-- DropForeignKey
ALTER TABLE "controls" DROP CONSTRAINT "controls_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "controls" DROP CONSTRAINT "controls_responsible_id_fkey";

-- DropForeignKey
ALTER TABLE "employees" DROP CONSTRAINT "employees_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "evidences" DROP CONSTRAINT "evidences_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "evidences" DROP CONSTRAINT "evidences_uploaded_by_id_fkey";

-- DropForeignKey
ALTER TABLE "frameworks" DROP CONSTRAINT "frameworks_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "incident_actions" DROP CONSTRAINT "incident_actions_incident_id_fkey";

-- DropForeignKey
ALTER TABLE "incident_actions" DROP CONSTRAINT "incident_actions_performed_by_id_fkey";

-- DropForeignKey
ALTER TABLE "incidents" DROP CONSTRAINT "incidents_assigned_to_id_fkey";

-- DropForeignKey
ALTER TABLE "incidents" DROP CONSTRAINT "incidents_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "incidents" DROP CONSTRAINT "incidents_reporter_id_fkey";

-- DropForeignKey
ALTER TABLE "policies" DROP CONSTRAINT "policies_approved_by_id_fkey";

-- DropForeignKey
ALTER TABLE "policies" DROP CONSTRAINT "policies_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "policies" DROP CONSTRAINT "policies_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "risk_assessments" DROP CONSTRAINT "risk_assessments_assessor_id_fkey";

-- DropForeignKey
ALTER TABLE "risk_assessments" DROP CONSTRAINT "risk_assessments_risk_id_fkey";

-- DropForeignKey
ALTER TABLE "risk_treatments" DROP CONSTRAINT "risk_treatments_responsible_id_fkey";

-- DropForeignKey
ALTER TABLE "risk_treatments" DROP CONSTRAINT "risk_treatments_risk_id_fkey";

-- DropForeignKey
ALTER TABLE "risks" DROP CONSTRAINT "risks_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "risks" DROP CONSTRAINT "risks_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "systems" DROP CONSTRAINT "systems_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "systems" DROP CONSTRAINT "systems_responsible_id_fkey";

-- DropForeignKey
ALTER TABLE "systems" DROP CONSTRAINT "systems_vendor_id_fkey";

-- DropForeignKey
ALTER TABLE "task_comments" DROP CONSTRAINT "task_comments_task_id_fkey";

-- DropForeignKey
ALTER TABLE "task_comments" DROP CONSTRAINT "task_comments_user_id_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_assigned_to_id_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_created_by_id_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "vendors" DROP CONSTRAINT "vendors_organization_id_fkey";

-- DropIndex
DROP INDEX "employees_employee_id_key";

-- AlterTable
ALTER TABLE "assets" DROP COLUMN "classification",
DROP COLUMN "created_at",
DROP COLUMN "description",
DROP COLUMN "metadata",
DROP COLUMN "organization_id",
DROP COLUMN "owner_id",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "owner" TEXT NOT NULL,
ADD COLUMN     "status" "AssetStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "value" DOUBLE PRECISION,
DROP COLUMN "type",
ADD COLUMN     "type" "AssetType" NOT NULL;

-- AlterTable
ALTER TABLE "audit_logs" DROP COLUMN "created_at",
DROP COLUMN "entity_id",
DROP COLUMN "entity_type",
DROP COLUMN "new_values",
DROP COLUMN "old_values",
DROP COLUMN "user_id",
ADD COLUMN     "details" JSONB,
ADD COLUMN     "ipAddress" TEXT,
ADD COLUMN     "resource" TEXT NOT NULL,
ADD COLUMN     "resourceId" TEXT NOT NULL,
ADD COLUMN     "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userAgent" TEXT,
ADD COLUMN     "userEmail" TEXT,
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "controls" DROP COLUMN "category",
DROP COLUMN "control_id",
DROP COLUMN "created_at",
DROP COLUMN "framework_id",
DROP COLUMN "implementation_status",
DROP COLUMN "organization_id",
DROP COLUMN "responsible_id",
DROP COLUMN "updated_at",
ADD COLUMN     "controlType" "ControlType" NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "effectiveness" "ControlEffectiveness" NOT NULL DEFAULT 'NOT_TESTED',
ADD COLUMN     "framework" "Framework" NOT NULL,
ADD COLUMN     "frequency" "Frequency" NOT NULL,
ADD COLUMN     "implementation" TEXT,
ADD COLUMN     "lastTested" TIMESTAMP(3),
ADD COLUMN     "nextReview" TIMESTAMP(3),
ADD COLUMN     "owner" TEXT,
ADD COLUMN     "riskId" TEXT,
ADD COLUMN     "status" "ControlStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "testingNotes" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "employees" DROP COLUMN "created_at",
DROP COLUMN "employee_id",
DROP COLUMN "first_name",
DROP COLUMN "last_name",
DROP COLUMN "organization_id",
DROP COLUMN "role",
DROP COLUMN "updated_at",
ADD COLUMN     "clearanceLevel" TEXT NOT NULL DEFAULT 'NONE',
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "employeeId" TEXT NOT NULL,
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "managerId" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "position" TEXT NOT NULL,
ADD COLUMN     "skills" TEXT[],
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedBy" TEXT NOT NULL,
DROP COLUMN "department",
ADD COLUMN     "department" "Department" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "EmployeeStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "incidents" DROP COLUMN "assigned_to_id",
DROP COLUMN "created_at",
DROP COLUMN "detected_at",
DROP COLUMN "impact_details",
DROP COLUMN "occurred_at",
DROP COLUMN "organization_id",
DROP COLUMN "reporter_id",
DROP COLUMN "updated_at",
ADD COLUMN     "affectedSystems" TEXT[],
ADD COLUMN     "businessImpact" TEXT,
ADD COLUMN     "category" "IncidentCategory" NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "detectedAt" TIMESTAMP(3),
ADD COLUMN     "financialImpact" DOUBLE PRECISION,
ADD COLUMN     "lessonsLearned" TEXT,
ADD COLUMN     "reportedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "resolution" TEXT,
ADD COLUMN     "resolvedAt" TIMESTAMP(3),
ADD COLUMN     "rootCause" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "severity",
ADD COLUMN     "severity" "Severity" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "IncidentStatus" NOT NULL DEFAULT 'REPORTED';

-- AlterTable
ALTER TABLE "policies" DROP COLUMN "approved_by_id",
DROP COLUMN "created_at",
DROP COLUMN "effective_date",
DROP COLUMN "organization_id",
DROP COLUMN "owner_id",
DROP COLUMN "review_date",
DROP COLUMN "updated_at",
ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "approvedBy" TEXT,
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "effectiveDate" TIMESTAMP(3),
ADD COLUMN     "reviewDate" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "version" SET DEFAULT '1.0',
DROP COLUMN "status",
ADD COLUMN     "status" "PolicyStatus" NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "risks" DROP COLUMN "created_at",
DROP COLUMN "custom_fields",
DROP COLUMN "organization_id",
DROP COLUMN "owner_id",
DROP COLUMN "probability",
DROP COLUMN "risk_score",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "likelihood" INTEGER NOT NULL,
ADD COLUMN     "mitigationPlan" TEXT,
ADD COLUMN     "residualRisk" INTEGER,
ADD COLUMN     "reviewDate" TIMESTAMP(3),
ADD COLUMN     "riskLevel" "RiskLevel" NOT NULL,
ADD COLUMN     "riskOwner" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "category",
ADD COLUMN     "category" "RiskCategory" NOT NULL,
ALTER COLUMN "impact" DROP DEFAULT,
DROP COLUMN "status",
ADD COLUMN     "status" "RiskStatus" NOT NULL DEFAULT 'IDENTIFIED';

-- AlterTable
ALTER TABLE "systems" DROP COLUMN "created_at",
DROP COLUMN "data_location",
DROP COLUMN "organization_id",
DROP COLUMN "responsible_id",
DROP COLUMN "updated_at",
DROP COLUMN "vendor_id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "owner" TEXT NOT NULL,
ADD COLUMN     "status" "SystemStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "criticality",
ADD COLUMN     "criticality" "Priority" NOT NULL DEFAULT 'MEDIUM';

-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "assigned_to_id",
DROP COLUMN "created_at",
DROP COLUMN "created_by_id",
DROP COLUMN "due_date",
DROP COLUMN "metadata",
DROP COLUMN "organization_id",
DROP COLUMN "updated_at",
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "controlId" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "dueDate" TIMESTAMP(3),
ADD COLUMN     "incidentId" TEXT,
ADD COLUMN     "riskId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "TaskStatus" NOT NULL DEFAULT 'PENDING',
DROP COLUMN "priority",
ADD COLUMN     "priority" "Priority" NOT NULL DEFAULT 'MEDIUM';

-- AlterTable
ALTER TABLE "users" DROP COLUMN "created_at",
DROP COLUMN "first_name",
DROP COLUMN "is_active",
DROP COLUMN "last_login",
DROP COLUMN "last_name",
DROP COLUMN "organization_id",
DROP COLUMN "password_hash",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "lastLogin" TIMESTAMP(3),
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER';

-- AlterTable
ALTER TABLE "vendors" DROP COLUMN "contact_email",
DROP COLUMN "country",
DROP COLUMN "created_at",
DROP COLUMN "organization_id",
DROP COLUMN "phone",
DROP COLUMN "risk_level",
DROP COLUMN "updated_at",
ADD COLUMN     "contactEmail" TEXT NOT NULL,
ADD COLUMN     "contactPhone" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "riskLevel" "RiskLevel" NOT NULL DEFAULT 'LOW',
ADD COLUMN     "status" "VendorStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "control_evidences";

-- DropTable
DROP TABLE "evidences";

-- DropTable
DROP TABLE "frameworks";

-- DropTable
DROP TABLE "incident_actions";

-- DropTable
DROP TABLE "organizations";

-- DropTable
DROP TABLE "risk_assessments";

-- DropTable
DROP TABLE "risk_treatments";

-- DropTable
DROP TABLE "task_comments";

-- CreateTable
CREATE TABLE "task_assignments" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "userId" TEXT,
    "employeeId" TEXT,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "task_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "risk_assignments" (
    "id" TEXT NOT NULL,
    "riskId" TEXT NOT NULL,
    "userId" TEXT,
    "employeeId" TEXT,
    "role" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "risk_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "control_assignments" (
    "id" TEXT NOT NULL,
    "controlId" TEXT NOT NULL,
    "userId" TEXT,
    "employeeId" TEXT,
    "role" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "control_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incident_assignments" (
    "id" TEXT NOT NULL,
    "incidentId" TEXT NOT NULL,
    "userId" TEXT,
    "employeeId" TEXT,
    "role" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "incident_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evidence" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "fileName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "category" "EvidenceCategory" NOT NULL,
    "createdBy" TEXT NOT NULL,
    "controlId" TEXT,
    "policyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "evidence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "task_assignments_taskId_userId_key" ON "task_assignments"("taskId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "task_assignments_taskId_employeeId_key" ON "task_assignments"("taskId", "employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "risk_assignments_riskId_userId_key" ON "risk_assignments"("riskId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "risk_assignments_riskId_employeeId_key" ON "risk_assignments"("riskId", "employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "control_assignments_controlId_userId_key" ON "control_assignments"("controlId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "control_assignments_controlId_employeeId_key" ON "control_assignments"("controlId", "employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "incident_assignments_incidentId_userId_key" ON "incident_assignments"("incidentId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "incident_assignments_incidentId_employeeId_key" ON "incident_assignments"("incidentId", "employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "employees_email_key" ON "employees"("email");

-- CreateIndex
CREATE UNIQUE INDEX "employees_employeeId_key" ON "employees"("employeeId");

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_riskId_fkey" FOREIGN KEY ("riskId") REFERENCES "risks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_controlId_fkey" FOREIGN KEY ("controlId") REFERENCES "controls"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "incidents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_assignments" ADD CONSTRAINT "task_assignments_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_assignments" ADD CONSTRAINT "task_assignments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_assignments" ADD CONSTRAINT "task_assignments_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "risks" ADD CONSTRAINT "risks_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "risk_assignments" ADD CONSTRAINT "risk_assignments_riskId_fkey" FOREIGN KEY ("riskId") REFERENCES "risks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "risk_assignments" ADD CONSTRAINT "risk_assignments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "risk_assignments" ADD CONSTRAINT "risk_assignments_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "controls" ADD CONSTRAINT "controls_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "controls" ADD CONSTRAINT "controls_riskId_fkey" FOREIGN KEY ("riskId") REFERENCES "risks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "control_assignments" ADD CONSTRAINT "control_assignments_controlId_fkey" FOREIGN KEY ("controlId") REFERENCES "controls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "control_assignments" ADD CONSTRAINT "control_assignments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "control_assignments" ADD CONSTRAINT "control_assignments_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incidents" ADD CONSTRAINT "incidents_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incident_assignments" ADD CONSTRAINT "incident_assignments_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "incidents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incident_assignments" ADD CONSTRAINT "incident_assignments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incident_assignments" ADD CONSTRAINT "incident_assignments_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "policies" ADD CONSTRAINT "policies_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidence" ADD CONSTRAINT "evidence_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidence" ADD CONSTRAINT "evidence_controlId_fkey" FOREIGN KEY ("controlId") REFERENCES "controls"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidence" ADD CONSTRAINT "evidence_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "policies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
