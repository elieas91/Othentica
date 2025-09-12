import Button from './Button';

const BlogCard = ({
  title,
  date,
  image,
  description,
  link,
  linkText = 'Read More',
  showReadMore,
  textToTheSide = true,
  className = '',
}) => {
  return (
    <div
      className={`mx-auto ${
        textToTheSide ? 'flex flex-col md:flex-row' : 'flex flex-col'
      } ${className}`}
    >
      {/* Blog Image */}
      <div
        className={`${
          textToTheSide ? 'md:w-1/2' : 'w-full'
        } h-full rounded-2xl shadow-md overflow-hidden`}
      >
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover rounded-2xl"
        />
      </div>

      {/* Blog Content */}
      <div
        className={`py-4 flex flex-col gap-3 ${
          textToTheSide ? 'md:w-1/2 md:pl-6' : ''
        }`}
      >
        <p className="text-sm opacity-80">{date}</p>
        <h2 className="text-lg md:text-xl font-semibold leading-snug">
          {title}
        </h2>

        {/* Optional Description */}
        {description && (
          <p className="text-sm opacity-70 leading-relaxed">{description}</p>
        )}

        {/* Optional Read More Button */}
        {showReadMore && (
          <a href={link} target="_blank" rel="noopener noreferrer">
            <Button variant="secondary">{linkText}</Button>
          </a>
        )}
      </div>
    </div>
  );
};

export default BlogCard;
