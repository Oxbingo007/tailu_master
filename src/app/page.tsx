import MessageForm from "@/components/MessageForm";

export default async function Home() {
  // 获取 Site Info
  const siteRes = await fetch("http://127.0.0.1:1337/api/site-info?populate=*");
  const siteData = await siteRes.json();
  const siteAttrs = siteData.data?.attributes || {};

  // 获取 Course
  const courseRes = await fetch("http://127.0.0.1:1337/api/courses?populate=*");
  const courseData = await courseRes.json();
  const courses = courseData.data || [];

  // 获取 Message
  const msgRes = await fetch("http://127.0.0.1:1337/api/messages");
  const msgData = await msgRes.json();
  const messages = msgData.data || [];

  // 社交媒体
  const socials = siteAttrs.platform || [];

  // 视频
  const videos = siteAttrs.video?.data || [];

  // blocks 富文本渲染函数（优化：特定标题高亮）
  function renderBlocks(blocks: any[]) {
    if (!Array.isArray(blocks)) return null;
    return blocks.map((block, idx) => {
      // 高亮"源远流长的传统艺术"和"太律能帮助您："
      if (
        block.type === "paragraph" &&
        Array.isArray(block.children) &&
        block.children.length === 1 &&
        typeof block.children[0].text === "string" &&
        (block.children[0].text.trim() === "源远流长的传统艺术：" || block.children[0].text.trim() === "太律能帮助您：")
      ) {
        return (
          <p key={idx} className="text-2xl font-semibold text-[#a94442] mb-2 mt-6">
            {block.children[0].text}
          </p>
        );
      }
      if (block.type === "paragraph" && Array.isArray(block.children)) {
        return (
          <p key={idx} className="mb-2">
            {block.children.map((child: any, cidx: number) => child.text || "").join("")}
          </p>
        );
      }
      // 可扩展更多类型
      return null;
    });
  }

  function getIconUrl(icon: any) {
    if (!icon) return "/404.svg";
    // 1. 直接是 { url }
    if (icon.url) {
      if (/^https?:\/\//.test(icon.url)) return icon.url;
      return `http://localhost:1337${icon.url}`;
    }
    // 2. Strapi 4 media: { data: { attributes: { url } } }
    if (icon.data?.attributes?.url) {
      const url = icon.data.attributes.url;
      if (/^https?:\/\//.test(url)) return url;
      return `http://localhost:1337${url}`;
    }
    // 3. Strapi 4 media array: { data: [ { attributes: { url } } ] }
    if (Array.isArray(icon.data) && icon.data[0]?.attributes?.url) {
      const url = icon.data[0].attributes.url;
      if (/^https?:\/\//.test(url)) return url;
      return `http://localhost:1337${url}`;
    }
    return "/404.svg";
  }

  const iconMap = {
    douyin: "/douyin.svg",
    tiktok: "/tiktok.svg",
    xiaohongshu: "/xiaohongshu.svg",
  };

  return (
    <main className="max-w-5xl mx-auto px-0 py-0 space-y-16">
      {/* 1. 顶部大横幅（只显示大logo，无文字） */}
      <section className="relative flex flex-col items-center justify-center min-h-[420px] w-full overflow-hidden" style={{background: 'linear-gradient(135deg, #f7e9ce 0%, #e6d2b5 100%)'}}>
        {/* SVG 波浪国风装饰 */}
        <svg className="absolute bottom-0 left-0 w-full h-40" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="#e6d2b5" fillOpacity="1" d="M0,224L60,202.7C120,181,240,139,360,144C480,149,600,203,720,197.3C840,192,960,128,1080,117.3C1200,107,1320,149,1380,170.7L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
        </svg>
        {/* 只显示大logo，无文字，logo撑满金色圆圈 */}
        {siteAttrs.logo?.data && (
          <div className="z-10 border-8 border-yellow-400 rounded-full bg-white shadow-2xl flex items-center justify-center" style={{ width: 340, height: 340 }}>
            <img
              src={`http://127.0.0.1:1337${siteAttrs.logo.data.attributes.url}`}
              alt="logo"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        )}
      </section>

      {/* 2. 太律介绍（左右分栏，左文右图） */}
      <section className="bg-[#faf7ef] rounded-2xl shadow p-8 md:p-12 flex flex-col md:flex-row items-start gap-8 md:gap-12 max-w-5xl mx-auto">
        {/* 左侧文字 */}
        <div className="flex-1 min-w-0">
          <h2 className="text-4xl font-bold mb-6 text-[#a94442] border-b-4 border-[#a94442] inline-block pb-1 pr-8">太律</h2>
          <div className="mt-6">
            <div className="text-base md:text-lg text-gray-800 leading-relaxed space-y-2">
              {renderBlocks(siteAttrs.introduction)}
            </div>
          </div>
        </div>
        {/* 右侧图片（多图竖排，整体垂直居中） */}
        {Array.isArray(siteAttrs.tailupicture?.data) && siteAttrs.tailupicture.data.length > 0 && (
          <div className="w-full md:w-[340px] flex-shrink-0 self-center flex flex-col gap-4">
            {siteAttrs.tailupicture.data.slice(0, 2).map((img: any, idx: number) => (
              <img
                key={img.id || idx}
                src={`http://127.0.0.1:1337${img.attributes.formats?.medium?.url || img.attributes.url}`}
                alt={img.attributes.name || `太律图片${idx+1}`}
                className="rounded-2xl shadow-xl object-cover w-full h-auto border border-[#e6d2b5]"
              />
            ))}
          </div>
        )}
      </section>

      {/* 3. 演奏视频区块 */}
      <section className="bg-white rounded-2xl shadow p-8">
        <h2 className="text-3xl font-bold mb-6 text-blue-700">律爷演奏太律</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.isArray(videos) && videos.length > 0 ? (
            videos.map((v: any, idx: number) =>
              v?.attributes?.url ? (
                <div key={idx} className="rounded-lg overflow-hidden shadow border bg-gray-50 flex flex-col items-center p-2">
                  <video
                    controls
                    className="w-full h-80 object-cover rounded"
                  >
                    <source src={`http://127.0.0.1:1337${v.attributes.url}`} />
                  </video>
                </div>
              ) : null
            )
          ) : (
            <div className="col-span-3 text-gray-400">暂无视频</div>
          )}
        </div>
      </section>

      {/* 4. 课程体系区块 */}
      <section className="bg-white rounded-2xl shadow p-8">
        <h2 className="text-3xl font-bold mb-8 text-blue-700">课程体系</h2>
        {/* 第一行：初级班（撑满） */}
        <div className="w-full mb-8">
          {courses[0] && (
            <div className="w-full bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow p-6 border border-blue-100">
              <h3 className="text-xl font-bold mb-4 text-gray-900 border-b-2 border-blue-200 pb-2">{courses[0].attributes.title}</h3>
              <div className="text-gray-800 whitespace-pre-line leading-relaxed">
                {courses[0].attributes.description}
              </div>
            </div>
          )}
        </div>
        {/* 第二行：中级班（左）+ 高级班（右） */}
        <div className="flex flex-col md:flex-row gap-8 justify-between">
          {courses[1] && (
            <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow p-6 border border-blue-100">
              <h3 className="text-xl font-bold mb-4 text-gray-900 border-b-2 border-blue-200 pb-2">{courses[1].attributes.title}</h3>
              <div className="text-gray-800 whitespace-pre-line leading-relaxed">
                {courses[1].attributes.description}
              </div>
            </div>
          )}
          {courses[2] && (
            <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow p-6 border border-blue-100">
              <h3 className="text-xl font-bold mb-4 text-gray-900 border-b-2 border-blue-200 pb-2">{courses[2].attributes.title}</h3>
              <div className="text-gray-800 whitespace-pre-line leading-relaxed">
                {courses[2].attributes.description}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 5. 留言表单区块 */}
      <section className="bg-white rounded-2xl shadow p-8">
        <h2 className="text-3xl font-bold mb-6 text-blue-700">留言</h2>
        <MessageForm />
      </section>

      {/* 6. 社交媒体区块 */}
      {Array.isArray(socials) && socials.length > 0 && (
        <section className="bg-white rounded-2xl shadow p-8 flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4 text-blue-700">关注律爷</h2>
          <div className="flex gap-6">
            {socials.map((item: any, idx: number) => (
              <a
                key={idx}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center group"
              >
                <img
                  src={iconMap[item.Platform as keyof typeof iconMap] || "/window.svg"}
                  alt={item.Platform}
                  className="w-10 h-10 mb-1 rounded-full border group-hover:scale-110 transition"
                />
                <span className="text-xs text-gray-600 group-hover:text-blue-700">{item.Platform || item.url}</span>
              </a>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
