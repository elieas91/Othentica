import SocialMedia from '../components/sections/Blog';
import Banner from '../components/ui/Banner';
import BannerBg from '../assets/img/blog/blog_bg.webp';
import BlogCard from '../components/ui/BlogCard';
import { blogData } from '../data/blogData.jsx';

const Blog = () => {
  return (
    <>
      <div className="bg-blue-400/40">
        <Banner
          title="Ideas That Matter"
          subtitle="Dive into in-depth blogs, fresh perspectives, and expert insights"
          description=""
          buttonText=""
          buttonVariant="accent"
          hasGradientTransparentBottom={false}
          backgroundImage={BannerBg}
          hasTransparentSides={false}
          hasOverlay={true}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6 lg:px-28">
        {/* First column: single BlogCard */}
        <div>
          {blogData[0] && (
            <BlogCard
              title={blogData[0].title}
              date={blogData[0].date}
              image={blogData[0].image}
              description={blogData[0].description}
              link={blogData[0].link}
              linkText={blogData[0].linkText}
              showReadMore={true}
              textToTheSide={false}
              className="min-h[250px] lg:min-h-[800px]"
            />
          )}
        </div>

        {/* Second column: three stacked BlogCards */}
        <div className="flex flex-col gap-6">
          {blogData.slice(1, 4).map((blog) => (
            <BlogCard
              key={blog.id}
              title={blog.title}
              date={blog.date}
              image={blog.image}
              description={blog.description}
              link={blog.link}
              linkText={blog.linkText}
              showReadMore={true}
              className="min-h-[250px]"
            />
          ))}
        </div>
      </div>
      <SocialMedia />
    </>
  );
};

export default Blog;
