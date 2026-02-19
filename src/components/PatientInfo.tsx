import { User, Phone, Mail, Calendar, CreditCard } from "lucide-react";

interface PatientInfoProps {
  patient: {
    patient_name: string;
    patient_dob: string;
    patient_age: number;
    patient_mobile: string;
    patient_email: string;
    patient_policy_no: string;
  };
  hospitalization: {
    doa: string;
    dod: string;
    provisional_final_diagnosis: string;
    treating_doctor_name: string;
  };
}

const PatientInfo = ({ patient, hospitalization }: PatientInfoProps) => (
  <div className="space-y-3">
    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
      <Field icon={<User className="h-3.5 w-3.5" />} label="Name" value={patient.patient_name} />
      <Field icon={<Calendar className="h-3.5 w-3.5" />} label="DOB" value={`${patient.patient_dob} (Age ${patient.patient_age})`} />
      <Field icon={<Phone className="h-3.5 w-3.5" />} label="Mobile" value={patient.patient_mobile} />
      <Field icon={<Mail className="h-3.5 w-3.5" />} label="Email" value={patient.patient_email} />
      <Field icon={<CreditCard className="h-3.5 w-3.5" />} label="Policy No" value={patient.patient_policy_no} />
      <Field icon={<User className="h-3.5 w-3.5" />} label="Doctor" value={hospitalization.treating_doctor_name} />
    </div>
    <div className="rounded-md bg-secondary/50 p-2.5">
      <p className="text-xs text-muted-foreground mb-0.5">Diagnosis</p>
      <p className="text-sm font-medium">{hospitalization.provisional_final_diagnosis}</p>
      <p className="text-xs text-muted-foreground mt-1">
        Admitted: {hospitalization.doa} → Discharged: {hospitalization.dod}
      </p>
    </div>
  </div>
);

const Field = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-start gap-1.5">
    <span className="text-muted-foreground mt-0.5 shrink-0">{icon}</span>
    <div className="min-w-0">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="text-sm font-medium truncate">{value}</p>
    </div>
  </div>
);

export default PatientInfo;
