
import { Project, CVData } from './types';

export const PROJECTS: Project[] = [
  {
    id: '1',
    name: 'Mindful Tracker',
    url: 'https://example-mindful.com',
    description: 'Một ứng dụng theo dõi tâm trạng và thói quen hàng ngày được xây dựng hoàn toàn bằng Vibe Coding.',
    tags: ['React', 'Tailwind', 'Gemini API'],
    images: ['https://picsum.photos/id/1/800/600', 'https://picsum.photos/id/2/800/600'],
    date: '2024-10-15'
  },
  {
    id: '2',
    name: 'Zen Garden Builder',
    url: 'https://example-zen.com',
    description: 'Trình tạo cảnh quan 2D thư giãn giúp người dùng giải tỏa căng thẳng qua các tương tác kéo thả.',
    tags: ['Canvas', 'React', 'Framer Motion'],
    images: ['https://picsum.photos/id/10/800/600', 'https://picsum.photos/id/11/800/600'],
    date: '2024-11-01'
  },
  {
    id: '3',
    name: 'Smart Recipe AI',
    url: 'https://example-recipe.com',
    description: 'Gợi ý món ăn dựa trên nguyên liệu còn lại trong tủ lạnh của bạn sử dụng sức mạnh của AI.',
    tags: ['AI Integration', 'Node.js', 'Vite'],
    images: ['https://picsum.photos/id/20/800/600', 'https://picsum.photos/id/21/800/600'],
    date: '2024-11-20'
  },
  {
    id: '4',
    name: 'Crypto Vibe Dashboard',
    url: 'https://example-crypto.com',
    description: 'Bảng điều khiển theo dõi thị trường tiền điện tử với phong cách thiết kế Cyberpunk tối giản.',
    tags: ['API', 'Charts', 'Recharts'],
    images: ['https://picsum.photos/id/30/800/600', 'https://picsum.photos/id/31/800/600'],
    date: '2024-12-05'
  }
];

export const CV_DATA: CVData = {
  fullName: "Nguyễn Vibe Coder",
  title: "Creative Developer & Vibe Enthusiast",
  bio: "Tôi đam mê việc biến các ý tưởng sáng tạo thành hiện thực thông qua phương pháp Vibe Coding - tập trung vào cảm xúc, trải nghiệm người dùng và tốc độ phát triển đột phá.",
  email: "hello@vibecoding.me",
  skills: ["React", "TypeScript", "Tailwind CSS", "Prompt Engineering", "UI/UX Design", "Gemini API"],
  experience: [
    {
      role: "Lead Creative Developer",
      company: "Future Lab",
      period: "2023 - Present",
      description: "Dẫn dắt các dự án thử nghiệm sử dụng AI để tối ưu hóa quy trình coding."
    },
    {
      role: "Frontend Engineer",
      company: "Tech Waves",
      period: "2021 - 2023",
      description: "Xây dựng các giao diện người dùng hiện đại và hiệu năng cao."
    }
  ]
};
