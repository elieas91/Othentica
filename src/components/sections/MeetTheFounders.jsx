import { teamData } from '../../data/teamData';
import LinkedInIcon from '../../assets/img/linkedin_icon.webp';
import WhatsappIcon from '../../assets/img/whatsapp_icon.webp';
import EmailIcon from '../../assets/img/email_icon.webp';

const MeetTheFounders = () => {
  return (
    <section className="pt-20 px-0" id="meet">
      <div className="max-w-[90%] w-full mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-6xl font-bold text-primary dark:text-neutral mb-4">
            Meet the Founders
          </h2>
        </div>

        {/* Team Members */}
        {teamData.map((member, index) => (
          <div
            key={member.id}
            className={`flex flex-row items-center gap-10 px-4 mx-auto pt-10 ${
              index % 2 !== 0 ? 'p-0' : 'pt-20'
            } ${
              index % 2 === 0 ? ' bg-white mb-16 p-4' : 'bg-white'
            } rounded-2xl `}
          >
            {/* Text Content - Position changes based on flipped property */}
            <div
              className={`flex flex-col w-1/2 ${
                member.flipped ? 'order-2' : 'order-1'
              }`}
            >
              <h3 className="text-5xl font-bold font-poppins capitalize text-secondary dark:text-neutral mb-6">
                {member.subtitle}
              </h3>
              {/* Name in outlined box */}
              <div className="inline-block border-2 w-1/4 border-primary dark:border-neutral rounded-lg px-4 py-2 mb-6">
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
            <div className={`w-1/2 ${member.flipped ? 'order-1' : 'order-2'}`}>
              <div className="relative h-fit overflow-hidden rounded-lg flex justify-center items-center">
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
                  className={`absolute top-1/2 transform -translate-y-[0%] space-y-3 ${
                    member.flipped ? 'left-[10%]' : 'right-0 -translate-x-1/2'
                  }`}
                >
                  {/* LinkedIn Button */}
                  <div className="w-36 h-12 bg-[#007ebb] rounded-lg flex items-center justify-start cursor-pointer hover:scale-105 transition-transform shadow-lg px-2 gap-x-2">
                    <img src={LinkedInIcon} width="35" />
                    <span className="text-white font-semibold text-sm">
                      {member.socialMedia.linkedin}
                    </span>
                  </div>

                  {/* Whatsapp Button */}
                  <div className="w-36 h-12 bg-[#26d044] rounded-lg flex items-center justify-start cursor-pointer hover:scale-105 transition-transform shadow-lg px-2 gap-x-2">
                    <img src={WhatsappIcon} width="35" />
                    <span className="text-white font-semibold text-sm">
                      {member.socialMedia.instagram}
                    </span>
                  </div>

                  {/* Email Button */}
                  <div className="w-36 h-12 bg-[#d77644] rounded-lg flex items-center justify-start cursor-pointer hover:scale-105 transition-transform shadow-lg px-2 gap-x-2">
                    <img src={EmailIcon} width="35" />
                    <span className="text-white font-semibold text-sm">
                      {member.socialMedia.instagram}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MeetTheFounders;
