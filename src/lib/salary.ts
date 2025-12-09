// lib/salary.ts
import { db } from './firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  Timestamp 
} from 'firebase/firestore';

export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  salary: number;
  email: string;
  phone: string;
  joinDate: string;
  manager: string;
  status: string;
  address: string;
  skills: string[];
  createdAt: Timestamp;
}

export interface SalaryRecord {
  id?: string;
  employeeId: string;
  employeeName: string;
  month: string;
  year: number;
  basicSalary: number;
  allowances: Allowance[];
  deductions: Deduction[];
  netPay: number;
  status: 'paid' | 'pending' | 'processed';
  paymentDate?: string;
  paymentMethod: string;
  createdAt: Timestamp;
}

export interface Allowance {
  type: string;
  amount: number;
}

export interface Deduction {
  type: string;
  amount: number;
}

export async function fetchEmployees(): Promise<Employee[]> {
  try {
    const querySnapshot = await getDocs(collection(db, 'employeeList'));
    const employees: Employee[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      employees.push({
        id: doc.id,
        name: data.name || '',
        position: data.position || '',
        department: data.department || '',
        salary: data.salary || 0,
        email: data.email || '',
        phone: data.phone || '',
        joinDate: data.joinDate || '',
        manager: data.manager || '',
        status: data.status || 'active',
        address: data.address || '',
        skills: data.skills || [],
        createdAt: data.createdAt || Timestamp.now(),
      });
    });
    
    return employees;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
}

export async function fetchSalaryRecords(month: string): Promise<SalaryRecord[]> {
  try {
    const q = query(
      collection(db, 'salaryManagement'),
      where('month', '==', month)
    );
    const querySnapshot = await getDocs(q);
    const records: SalaryRecord[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      records.push({
        id: doc.id,
        employeeId: data.employeeId,
        employeeName: data.employeeName,
        month: data.month,
        year: data.year,
        basicSalary: data.basicSalary,
        allowances: data.allowances || [],
        deductions: data.deductions || [],
        netPay: data.netPay,
        status: data.status,
        paymentDate: data.paymentDate,
        paymentMethod: data.paymentMethod,
        createdAt: data.createdAt,
      });
    });
    
    return records;
  } catch (error) {
    console.error('Error fetching salary records:', error);
    throw error;
  }
}

export async function saveSalaryRecord(record: Omit<SalaryRecord, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'salaryManagement'), {
      ...record,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving salary record:', error);
    throw error;
  }
}

export async function updateSalaryStatus(recordId: string, status: SalaryRecord['status']): Promise<void> {
  try {
    const docRef = doc(db, 'salaryManagement', recordId);
    await updateDoc(docRef, {
      status,
      paymentDate: status === 'paid' ? new Date().toISOString().split('T')[0] : null,
    });
  } catch (error) {
    console.error('Error updating salary status:', error);
    throw error;
  }
}

export async function generatePayroll(month: string, year: number): Promise<SalaryRecord[]> {
  try {
    const employees = await fetchEmployees();
    const existingRecords = await fetchSalaryRecords(month);
    
    const newRecords: SalaryRecord[] = [];
    
    for (const employee of employees) {
      const existingRecord = existingRecords.find(record => record.employeeId === employee.id);
      
      if (!existingRecord && employee.status === 'active') {
        const basicSalary = employee.salary;
        const allowances: Allowance[] = [
          { type: 'Basic Salary', amount: basicSalary },
          { type: 'House Rent', amount: basicSalary * 0.4 },
          { type: 'Medical', amount: 1500 },
        ];
        
        const deductions: Deduction[] = [
          { type: 'Income Tax', amount: basicSalary * 0.1 },
          { type: 'Provident Fund', amount: basicSalary * 0.05 },
        ];
        
        const totalAllowances = allowances.reduce((sum, allowance) => sum + allowance.amount, 0);
        const totalDeductions = deductions.reduce((sum, deduction) => sum + deduction.amount, 0);
        const netPay = totalAllowances - totalDeductions;
        
        const newRecord: Omit<SalaryRecord, 'id'> = {
          employeeId: employee.id,
          employeeName: employee.name,
          month,
          year,
          basicSalary,
          allowances,
          deductions,
          netPay,
          status: 'pending',
          paymentMethod: 'Bank Transfer',
          createdAt: Timestamp.now(),
        };
        
        const recordId = await saveSalaryRecord(newRecord);
        newRecords.push({ ...newRecord, id: recordId });
      }
    }
    
    return newRecords;
  } catch (error) {
    console.error('Error generating payroll:', error);
    throw error;
  }
}

export async function getPayrollStats(month: string) {
  try {
    const records = await fetchSalaryRecords(month);
    const employees = await fetchEmployees();
    
    const totalEmployees = employees.filter(e => e.status === 'active').length;
    const processedPayrolls = records.filter(r => r.status === 'paid' || r.status === 'processed').length;
    const pendingPayrolls = records.filter(r => r.status === 'pending').length;
    const totalPayrollAmount = records.reduce((sum, r) => sum + r.netPay, 0);
    
    return {
      totalEmployees,
      processedPayrolls,
      pendingPayrolls,
      totalPayrollAmount,
      records,
    };
  } catch (error) {
    console.error('Error getting payroll stats:', error);
    throw error;
  }
}