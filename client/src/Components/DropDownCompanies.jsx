// src/Components/DropDownCompanies.jsx
import { useEffect, useState } from 'react';
import { useCompany } from '../context/CompanyContext';
import axios from 'axios';
import Select from 'react-select'

export const DropDownCompanies = () => {
    const [companies, setCompanies] = useState([]);
    const { setSelectedCompany } = useCompany();

    const handleChange = (selectedOption) => {
        setSelectedCompany(selectedOption);
    };

    useEffect(() => {
        axios.get('https://calidad-5vft.vercel.app/companies')
            .then(response => {
                const options = response.data.map(company => ({
                    value: company._id,
                    label: company.name,
                    ...company // incluir todos los datos de la empresa
                }));
                setCompanies(options);
            })
            .catch(error => {
                console.error('Error al obtener las empresas:', error);
            });
    }, []);

    return (
        <Select
            options={companies}
            onChange={handleChange}
            placeholder="Selecciona una empresa"
            className="text-black"
        />
    );
};
