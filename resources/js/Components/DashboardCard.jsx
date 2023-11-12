import React from 'react'
import { Card } from 'react-bootstrap'

const DashboardCard = ({ label = "Card", subLabel = "", icon, variant = "primary", value = "100",className }) => {
    return (
        <Card className={`dashboard-card shadow-[inset_0_-2px_0_0_#fff,0_10px_16px_0_rgba(0,0,0,0.03),0_4px_6px_0_rgba(0,0,0,0.03),inset_0_-4px_10px_0_rgba(0,0,0,0.05)] ${className}`}>
            <Card.Body className='p-4 flex justify-between'>
                <div className=''>
                    <div className={`icon p-2 flex items-center justify-center w-[45px] h-[45px] rounded-2 fs-4 bg-gradient-to-tr from-emerald-600 text-white to-emerald-400 text-center mb-3`}>
                        {/* <i className="fi fi-rr-boxes leading-none"></i>  */}
                        {icon}
                    </div>
                    <p className=" mb-2 font-medium text-black-50 fs-6">{label}</p>
                    {subLabel && (
                        <p className="mt-0 mb-0 fw-bold text-slate-800 fs-6">{subLabel}</p>
                    )}
                </div>
                <div className=''>
                    <p className={`my-0 fw-bold text-dark fs-4`}>
                        {value}
                    </p>
                </div>
            </Card.Body>
        </Card>
    )
}

export default DashboardCard
