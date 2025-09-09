import Flame from '../../assets/img/flame.webp';
import { appFeaturesData } from '../../data/appFeaturesData';
import { appBenefitsData } from '../../data/appBenefitsData';

const Features = () => {
  return (
    <section className="py-16 px-8 lg:px-16 rounded-3xl shadow-professional bg-white dark:bg-primary relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
            <div className="flex justify-center items-center mb-8">
              <span className="flex items-center justify-center w-full max-w-md bg-secondary rounded-lg shadow-md px-8 py-6">
                <h2 className="text-xl lg:text-3xl font-bold text-white dark:text-neutral">
                  Features
                </h2>
              </span>
            </div>
        </div>
        <div className="relative z-10 flex flex-col justify-start h-[300px] overflow-y-auto top-[2rem]">
          <ul className="text-gray-600 text-xl text-left px-4 leading-[2.5rem] mx-auto">
            {appFeaturesData.map((feature) => (
              <li key={feature.id} className="flex items-start mb-2">
                <img
                  src={Flame}
                  alt="Bullet Icon"
                  className="w-auto h-7 mr-3 mt-1"
                />
                <span>{feature.feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

const Benefits = () => {
  return (
    <section className="py-16 px-8 lg:px-16 rounded-3xl shadow-professional bg-white dark:bg-primary relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
            <div className="flex justify-center items-center mb-8">
              <span className="flex items-center justify-center w-full max-w-md bg-secondary rounded-lg shadow-md px-8 py-6">
                <h2 className="text-xl lg:text-3xl font-bold text-white dark:text-neutral">
                  Benefits
                </h2>
              </span>
            </div>
        </div>
        <div className="relative z-10 flex flex-col justify-start h-[300px] overflow-y-auto top-[2rem]">
          <ul className="text-gray-600 text-xl text-left px-4 leading-[2.5rem] mx-auto">
            {appBenefitsData.map((benefit) => (
              <li key={benefit.id} className="flex items-start mb-2">
                <img
                  src={Flame}
                  alt="Bullet Icon"
                  className="w-auto h-7 mr-3 mt-1"
                />
                <span>{benefit.benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

const FeaturesAndBenefits = () => {
  return (
    <section className="py-16 px-8 lg:px-16 bg-white dark:bg-primary relative overflow-hidden">
      <div className="lg, md:mx-16 ">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1">
            <Benefits />
          </div>
          <div className="flex-1">
            <Features />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesAndBenefits;
