import { securityData } from '../../data/securityData';
import Card from '../ui/Card';
import App from '../../assets/img/services/app.webp';

const Security = () => {
  return (
    <section className="py-16 px-8 lg:px-16 bg-white dark:bg-primary rounded-xl shadow-lg mt-12">
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
          {securityData.map((security) => (
            <Card
              key={security.id}
              className="text-center hover:scale-105 transition-transform duration-300 h-full group"
            >
              <div className="flex flex-col flex-grow">
                <div className="text-5xl mb-6">
                  <img
                    src={App}
                    alt={security.title}
                    className="mx-auto w-20 h-20 object-contain"
                  />
                </div>
                <h3 className="text-xl font-semibold text-primary dark:text-neutral mb-4">
                  {security.title}
                </h3>
                <p className="text-primary dark:text-gray-200 mb-8 leading-relaxed">
                  {security.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Security;
