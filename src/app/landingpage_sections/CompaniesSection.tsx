import Image from "next/image";
import React from "react";

const companies: {
  id: number;
  name: string;
  logo: string;
  width: number;
  height: number;
}[] = [
  {
    id: 1,
    name: "Airbnb",
    logo: "/images/companies/airbnb.png",
    width: 750,
    height: 432,
  },
  {
    id: 2,
    name: "Google",
    logo: "/images/companies/google.png",
    width: 700,
    height: 382,
  },
  {
    id: 3,
    name: "Uber",
    logo: "/images/companies/uber.png",
    width: 600,
    height: 393,
  },
  {
    id: 4,
    name: "Salesforce",
    logo: "/images/companies/salesforce.png",
    width: 350,
    height: 791,
  },
  {
    id: 5,
    name: "Arc",
    logo: "/images/companies/arc.png",
    width: 300,
    height: 850,
  },
];

const CompaniesSection = () => {
  return (
    <ul className="grid grid-cols-3 sm:grid-cols-5 items-center scale-75 md:scale-50 lg:scale-[.45] gap-8 sm:gap-16 lg:gap-24">
      {companies.map((company) => (
        <li key={company.id} >
          <Image
            height={0}
            width={company.width}
            src={company.logo}
            alt={company.name}
            className={`grayscale transition ${
              company.name == "Uber" && "opacity-50"
            }`}
            draggable={false}
          />
        </li>
      ))}
    </ul>
  );
};

export default CompaniesSection;
