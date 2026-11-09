// Card colours follow the Thai colour of each day (จันทร์ เหลือง, อังคาร ชมพู, พฤหัสฯ ส้ม, ศุกร์ ฟ้า, อาทิตย์ แดง)
export default {
  id: 'days', no: 2, title: 'Days', th: 'วันในสัปดาห์', icon: '📅',
  theme: { sky1: '#c9b8ff', sky2: '#ffe3f1', hill1: '#ffd6e8', hill2: '#ffe9a8', accent: '#d6336c', accentDark: '#a61e4d' },
  back: { c1: '#FF6FAE', c2: '#C2255C', c3: '#FFB703', ink: '#8C1340', arcs: ['#FF4B3E', '#FFC300', '#FF6FAE', '#4DB8FF'], ring: ['📅', '☀️', '🌙', '⭐', '❤️'] },
  words: [
    { id: 'monday',   en: 'Monday',   th: 'วันจันทร์',    c1: '#FFF3A3', c2: '#FFC300', ink: '#8A5A00', letters: ['#F59F00', '#E67700', '#FAB005', '#F08C00'] },
    { id: 'tuesday',  en: 'Tuesday',  th: 'วันอังคาร',    c1: '#FFD6E8', c2: '#FF6FAE', ink: '#A3115A', letters: ['#F06595', '#D6336C', '#E64980', '#C2255C'] },
    { id: 'thursday', en: 'Thursday', th: 'วันพฤหัสบดี',  c1: '#FFE0B8', c2: '#FF8C1A', ink: '#9A4A00', letters: ['#FD7E14', '#E8590C', '#F76707', '#D9480F'] },
    { id: 'friday',   en: 'Friday',   th: 'วันศุกร์',     c1: '#D6F0FF', c2: '#4DB8FF', ink: '#0B5C99', letters: ['#339AF0', '#1C7ED6', '#4DABF7', '#1971C2'] },
    { id: 'sunday',   en: 'Sunday',   th: 'วันอาทิตย์',   c1: '#FFD3CF', c2: '#FF4B3E', ink: '#A11A12', letters: ['#FA5252', '#E03131', '#F03E3E', '#C92A2A'] },
  ],
};
