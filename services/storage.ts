import { CompanyData } from '../types';

const STORAGE_KEY = 'recuperaPisCofinsData';

export const saveData = (data: Record<string, CompanyData>): void => {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(STORAGE_KEY, serializedData);
  } catch (error) {
    console.error("Could not save data to localStorage", error);
  }
};

export const loadData = (): Record<string, CompanyData> => {
  try {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    if (serializedData === null) {
      return {};
    }
    return JSON.parse(serializedData);
  } catch (error) {
    console.error("Could not load data from localStorage", error);
    return {};
  }
};
