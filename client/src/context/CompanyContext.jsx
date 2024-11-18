// src/context/CompanyContext.jsx
import { createContext, useState, useContext } from 'react';

const CompanyContext = createContext();

export const CompanyProvider = ({ children }) => {
    const [selectedCompany, setSelectedCompany] = useState(null);
    
    const resetCompany = () => {
        setSelectedCompany(null);
    };

    return (
        <CompanyContext.Provider value={{ selectedCompany, setSelectedCompany, resetCompany }}>
            {children}
        </CompanyContext.Provider>
    );
};

export const useCompany = () => useContext(CompanyContext);
