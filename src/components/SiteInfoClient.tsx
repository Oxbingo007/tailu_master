"use client";

type Props = {
  slogan: string;
  introduction: any;
  logo: any;
  video: any;
};

export default function SiteInfoClient({
  slogan,
  introduction,
  logo,
  video,
}: Props) {
  return (
    <div className="bg-white rounded shadow p-6 mb-8">
      <h1>{slogan}</h1>
      <div>
        {/* 渲染介绍内容 */}
        {Array.isArray(introduction)
          ? introduction.map((item, idx) => (
              <p key={idx}>{item.text || JSON.stringify(item)}</p>
            ))
          : introduction}
      </div>
      {/* 渲染 logo 图片 */}
      {logo?.data && (
        <img
          src={`http://127.0.0.1:1337${logo.data.attributes.url}`}
          alt="logo"
          width={120}
        />
      )}
      {/* 渲染视频，兼容单文件和多文件 */}
      {video?.data && (
        Array.isArray(video.data) ? (
          video.data.map((v, idx) =>
            v?.attributes?.url ? (
              <video controls width={320} key={idx}>
                <source src={`http://127.0.0.1:1337${v.attributes.url}`} />
              </video>
            ) : null
          )
        ) : (
          video.data?.attributes?.url && (
            <video controls width={320}>
              <source src={`http://127.0.0.1:1337${video.data.attributes.url}`} />
            </video>
          )
        )
      )}
    </div>
  );
}
