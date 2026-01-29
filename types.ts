export enum ComplianceStandard {
  HIPAA = 'HIPAA',
  FDA_21_CFR_11 = 'FDA 21 CFR Part 11',
  GDPR = 'GDPR',
  ISO_13485 = 'ISO 13485',
  HL7 = 'HL7 FHIR'
}

export enum Priority {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low'
}

export enum TestStatus {
  DRAFT = 'Draft',
  REVIEWED = 'Reviewed',
  APPROVED = 'Approved'
}

export interface TestStep {
  stepNumber: number;
  action: string;
  expectedResult: string;
}

export interface TestCase {
  id: string;
  title: string;
  description: string;
  preconditions: string;
  priority: Priority;
  complianceTags: ComplianceStandard[];
  steps: TestStep[];
  status: TestStatus;
  createdAt: string;
  traceabilityId?: string; // Links to requirement ID
}

export interface GenerationRequest {
  requirementText: string;
  context?: string;
  selectedStandards: ComplianceStandard[];
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}
