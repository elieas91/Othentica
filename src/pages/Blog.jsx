import SocialMedia from '../components/sections/Blog';
import Banner from '../components/ui/Banner';
import BannerBg from '../assets/img/blog/blog_bg.webp';

const Blog = () => {
  return (
    <div className="bg-neutral dark:bg-primary">
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
      <SocialMedia />
    </div>
  );
};

export default Blog;
