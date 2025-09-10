import React from 'react';
import { securityData } from '../../data/securityData';
import Card from '../ui/Card';
import FlameSolid from '../../assets/img/flame_solid.webp';

const Security = () => {

  return (
    <section className="py-16 px-8 lg:px-16 bg-white dark:bg-primary rounded-xl shadow-lg mt-12">
      {/* Right Flame */}
      <img
        src={FlameSolid}
        alt="Right Flame"
        className="absolute right-4 lg:right-16 top-1/2 w-48 lg:w-64 opacity-30 pointer-events-none "
      />
      {/* Left Flame 1 */}
      <img
        src={FlameSolid}
        alt="Left Flame"
        className="absolute left-4 lg:left-16 top-1/4 w-32 lg:w-44 opacity-30 pointer-events-none "
      />
      {/* Left Flame 2 */}
      <img
        src={FlameSolid}
        alt="Left Flame"
        className="absolute left-8 lg:left-36 top-1/2 w-32 lg:w-44 opacity-30 pointer-events-none "
      />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold text-primary dark:text-neutral mb-8">
            Entreprise-Grade Security and Scale
          </h2>
          <p className="text-xl text-primary dark:text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Our platform is built to protect your organization at every layer,
            combining advanced security with seamless scalability.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {securityData.map((security) => {
            return (
              <Card
                key={security.id}
                showHoverShadow={false}
                className="text-center h-full group"
              >
                <div className="flex flex-col flex-grow">
                  <div className="text-5xl mb-6">
                    <img
                      src={security.icon}
                      alt={security.title}
                      className="mx-auto w-20 h-20 object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-primary dark:text-neutral mb-4">
                    {security.title}
                  </h3>
                  <div className="text-primary dark:text-gray-200 mb-8 leading-relaxed h-[200px] overflow-y-auto px-2">
                    {typeof security.description === 'string'
                      ? security.description
                      : String(security.description)}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Security;
