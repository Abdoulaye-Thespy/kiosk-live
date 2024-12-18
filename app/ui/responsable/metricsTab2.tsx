'use client'

import React from 'react'
import { Card, CardContent } from "@/components/ui/card"

const metrics = [
    {
        id: 'all',
        label: 'Demandes en cours',
        value: '55',
        count: '10',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="20" viewBox="0 0 24 20" fill="none">
        <g filter="url(#filter0_d_4061_26723)">
          <path d="M11.9999 8.74992C11.3096 8.74992 10.7499 9.30956 10.7499 9.99992C10.7499 10.6903 11.3096 11.2499 11.9999 11.2499C12.6903 11.2499 13.2499 10.6903 13.2499 9.99992C13.2499 9.30956 12.6903 8.74992 11.9999 8.74992Z" fill="white"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M6.30114 3.33325L17.6987 3.33325C18.138 3.33324 18.517 3.33323 18.8291 3.35873C19.1586 3.38565 19.4862 3.44508 19.8016 3.60574C20.272 3.84542 20.6544 4.22787 20.8941 4.69828C21.0548 5.0136 21.1142 5.34128 21.1411 5.67073C21.1666 5.98287 21.1666 6.36183 21.1666 6.80112V13.1987C21.1666 13.638 21.1666 14.017 21.1411 14.3291C21.1142 14.6586 21.0548 14.9862 20.8941 15.3016C20.6544 15.772 20.272 16.1544 19.8016 16.3941C19.4862 16.5548 19.1586 16.6142 18.8291 16.6411C18.517 16.6666 18.138 16.6666 17.6987 16.6666L6.30101 16.6666C5.86178 16.6666 5.48284 16.6666 5.17073 16.6411C4.84128 16.6142 4.51359 16.5548 4.19828 16.3941C3.72787 16.1544 3.34542 15.772 3.10574 15.3016C2.94508 14.9862 2.88565 14.6586 2.85873 14.3291C2.83323 14.017 2.83324 13.638 2.83325 13.1987V6.80109C2.83324 6.36183 2.83323 5.98286 2.85873 5.67073C2.88565 5.34128 2.94508 5.01359 3.10574 4.69828C3.34542 4.22787 3.72787 3.84542 4.19828 3.60574C4.5136 3.44508 4.84128 3.38565 5.17073 3.35873C5.48286 3.33323 5.86187 3.33324 6.30114 3.33325ZM9.08325 9.99992C9.08325 8.38909 10.3891 7.08325 11.9999 7.08325C13.6108 7.08325 14.9166 8.38909 14.9166 9.99992C14.9166 11.6108 13.6108 12.9166 11.9999 12.9166C10.3891 12.9166 9.08325 11.6108 9.08325 9.99992ZM6.99992 7.49992C7.46016 7.49992 7.83325 7.87302 7.83325 8.33325V11.6666C7.83325 12.1268 7.46016 12.4999 6.99992 12.4999C6.53968 12.4999 6.16659 12.1268 6.16659 11.6666V8.33325C6.16659 7.87302 6.53968 7.49992 6.99992 7.49992ZM17.8333 8.33325C17.8333 7.87302 17.4602 7.49992 16.9999 7.49992C16.5397 7.49992 16.1666 7.87302 16.1666 8.33325V11.6666C16.1666 12.1268 16.5397 12.4999 16.9999 12.4999C17.4602 12.4999 17.8333 12.1268 17.8333 11.6666V8.33325Z" fill="white"/>
        </g>
        <defs>
          <filter id="filter0_d_4061_26723" x="0.833252" y="2.33325" width="22.3333" height="17.3333" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dy="1"/>
            <feGaussianBlur stdDeviation="1"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0.0509804 0 0 0 0 0.0509804 0 0 0 0 0.0705882 0 0 0 0.2 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4061_26723"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_4061_26723" result="shape"/>
          </filter>
        </defs>
      </svg>,
        iconBg: 'bg-orange-500',
        iconColor: 'text-red-500'
    },
    {
        id: 'pending',
        label: 'Demandes en resolue',
        value: '55',
        count: '10',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="20" viewBox="0 0 18 20" fill="none">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M18 11C18 14.7497 18 16.6246 17.0451 17.9389C16.7367 18.3634 16.3634 18.7367 15.9389 19.0451C14.6246 20 12.7497 20 9 20C5.25027 20 3.3754 20 2.06107 19.0451C1.6366 18.7367 1.26331 18.3634 0.954914 17.9389C0 16.6246 0 14.7497 0 11V9C0 8.16106 0 7.41596 0.0106945 6.75L0.0808201 6.75C0.932837 6.75007 1.45182 6.75011 1.8995 6.67921C4.35988 6.28952 6.28952 4.35988 6.67921 1.8995C6.75011 1.45182 6.75007 0.932837 6.75 0.0808201L6.75 0.0106945C7.41596 0 8.16106 0 9 0C12.7497 0 14.6246 0 15.9389 0.954914C16.3634 1.26331 16.7367 1.6366 17.0451 2.06107C18 3.3754 18 5.25027 18 9V11ZM6 10.25C5.58579 10.25 5.25 10.5858 5.25 11C5.25 11.4142 5.58579 11.75 6 11.75H12C12.4142 11.75 12.75 11.4142 12.75 11C12.75 10.5858 12.4142 10.25 12 10.25H6Z" fill="white"/>
        <path d="M1.66485 5.19768C1.35646 5.24652 0.975676 5.24987 0.0653362 5.25C0.159744 3.81037 0.390566 2.83783 0.954914 2.06107C1.26331 1.6366 1.6366 1.26331 2.06107 0.954914C2.83783 0.390566 3.81037 0.159744 5.25 0.0653362C5.24987 0.975676 5.24652 1.35645 5.19768 1.66485C4.90965 3.48339 3.48339 4.90965 1.66485 5.19768Z" fill="white"/>
        </svg>,
        iconBg: 'bg-orange-500',
        iconColor: 'text-red-500'
    },
]


export default function MetricsResponsable2() {

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
                {metrics.map((metric) => (
                    <Card key={metric.id} className="overflow-hidden">
                        <CardContent className="p-2">
                            <div className="flex items-start gap-4 flex-col">
                                <span className={`text-2xl ${metric.iconBg} ${metric.iconColor} p-3 rounded-lg`}>
                                    {metric.icon}
                                </span>
                                <div>
                                   <div className="flex items-center justify-between gap-2">
                                        <p className="text-xm ">{metric.label}</p>
                                        <span className="px-2 py-1 text-xm rounded-full bg-black-500 bg-gray-200">
                                            {metric.count}
                                        </span>
                                    </div>
                                    <p className="text-lg font-semibold text-black-500">{metric.value}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

        </div>
    )
}
