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
    width: 70,
    height: 432,
  },
  {
    id: 2,
    name: "Google",
    logo: "/images/companies/google.png",
    width: 70,
    height: 382,
  },
  {
    id: 3,
    name: "Uber",
    logo: "/images/companies/uber.png",
    width: 50,
    height: 393,
  },
  {
    id: 5,
    name: "Arc",
    logo: "/images/companies/arc.png",
    width: 40,
    height: 850,
  },
];

const CompaniesSection = () => {
  return (
    <ul className="flex items-center justify-center gap-8 w-fit mx-auto">
      {companies.map((company) => (
        <li key={company.id}>
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
