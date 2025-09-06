import { teamData } from '../../data/teamData';
import LinkedInIcon from '../../assets/img/linkedin_icon.webp';
import WhatsappIcon from '../../assets/img/whatsapp_icon.webp';
import EmailIcon from '../../assets/img/email_icon.webp';
import WhatsAppButton from '../ui/WhatsappButton';
import AnimateOnScroll from '../ui/AnimateOnScroll';

const MeetTheFounders = () => {
  return (
    <section className="pt-20 px-0" id="meet">
      <div className="max-w-[90%] w-full mx-auto">
        <AnimateOnScroll animation="fadeInUp" delay={100}>
          <div className="text-center mb-16">
            <h2 className="text-6xl font-bold text-primary dark:text-neutral mb-4">
              Meet the Founders
            </h2>
          </div>
        </AnimateOnScroll>

        {/* Team Members */}
        {teamData.map((member, index) => (
          <AnimateOnScroll 
            key={member.id}
            animation={index % 2 === 0 ? "fadeInLeft" : "fadeInRight"} 
            delay={200 + (index * 200)}
            duration={800}
          >
            <div
              className={`flex flex-col md:flex-row items-center gap-10 px-4 mx-auto pt-10 ${
                index % 2 !== 0 ? 'p-0' : 'pt-20'
              } ${
                index % 2 === 0 ? ' bg-white mb-16 p-4' : 'bg-white'
              } rounded-2xl `}
            >
            {/* Text Content - Position changes based on flipped property */}
            <div
              className={`flex flex-col w-full md:w-1/2 ${
                member.flipped ? 'order-1 md:order-2' : 'order-2 md:order-1'
              }`}
            >
              <h3 className="text-5xl text-center md:text-left font-bold font-poppins capitalize text-secondary dark:text-neutral mb-6">
                {member.subtitle}
              </h3>
              {/* Name in outlined box */}
              <div className="self-center md:self-start border-2 border-primary dark:border-neutral rounded-lg px-4 py-2 mb-6">
                <span className="text-xl font-bold text-primary dark:text-neutral">
                  {member.name}
                </span>
              </div>
              <h1 className="text-xl font-normal text-primary font-sans dark:text-neutral mb-6">
                {Array.isArray(member.description) &&
                  member.description.map((paragraph, index) => (
                    <p key={index} className={index === 0 ? '' : 'mt-3'}>
                      {paragraph}
                    </p>
                  ))}

                {/* Name and role */}
                <p className="mt-6 font-bold">{member.name}</p>
                {Array.isArray(member.role) ? (
                  member.role.map((role, idx) => (
                    <p key={idx} className="font-bold">
                      {role}
                    </p>
                  ))
                ) : (
                  <p className="font-bold">{member.role}</p>
                )}
              </h1>
            </div>

            {/* Image Section - Position changes based on flipped property */}
            <div className={`w-full md:w-1/2 ${member.flipped ? 'order-1' : 'order-2'}`}>
              <div className="relative h-fit overflow-visible rounded-lg flex justify-center items-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-2/3 object-cover"
                  style={{
                    WebkitMaskImage: `
                      radial-gradient(ellipse 80% 80% at center, black 60%, transparent 70%),
                      linear-gradient(to bottom, black 90%, transparent 100%)
                    `,
                    WebkitMaskComposite: 'destination-in', // keeps the intersection
                    maskComposite: 'intersect', // for standard syntax
                  }}
                />
                {/* Social Media Buttons */}
                <div
                  className={`absolute top-1/2 transform -translate-y-1/2 space-y-3 ${
                    member.flipped 
                      ? 'left-0 md:left-[10%] -translate-x-2 md:translate-x-0' 
                      : 'right-0 -translate-x-2 md:translate-x-1/2'
                  }`}
                >
                  {/* LinkedIn Button */}
                  <a
                    href={member.socialMedia.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-28 md:w-36 h-10 md:h-12 bg-[#007ebb] rounded-lg flex items-center justify-start cursor-pointer hover:scale-105 transition-transform shadow-lg px-2 gap-x-1 md:gap-x-2"
                  >
                    <img src={LinkedInIcon} className="w-6 md:w-8" />
                    <span className="text-white font-semibold text-xs md:text-sm">
                      LinkedIn
                    </span>
                  </a>

                  <WhatsAppButton type="rectangle" />

                  {/* Email Button */}
                  <a
                    href={`mailto:${member.socialMedia.email}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-28 md:w-36 h-10 md:h-12 bg-[#d77644] rounded-lg flex items-center justify-start cursor-pointer hover:scale-105 transition-transform shadow-lg px-2 gap-x-1 md:gap-x-2"
                  >
                    <img src={EmailIcon} className="w-6 md:w-8" />
                    <span className="text-white font-semibold text-xs md:text-sm">
                      Email
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          </AnimateOnScroll>
        ))}
      </div>
    </section>
  );
};

export default MeetTheFounders;
