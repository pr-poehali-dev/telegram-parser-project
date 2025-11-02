import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import Header from '@/components/Header';
import DashboardTab from '@/components/DashboardTab';
import ChannelsTab from '@/components/ChannelsTab';
import ParsingTab from '@/components/ParsingTab';
import AnalyticsTab from '@/components/AnalyticsTab';
import ExportTab from '@/components/ExportTab';

const mockChannels = [
  { id: 1, name: 'Инвестиции России', members: 45000, active: true, parsed: 1243, category: 'Акции' },
  { id: 2, name: 'Crypto Invest Pro', members: 32000, active: true, parsed: 876, category: 'Крипто' },
  { id: 3, name: 'Недвижимость 2024', members: 28000, active: false, parsed: 654, category: 'Недвижимость' },
  { id: 4, name: 'Стартап Инвестиции', members: 19000, active: true, parsed: 432, category: 'Стартапы' },
];

const mockCases = [
  { id: 1, title: 'IPO Tech Startup', category: 'Стартапы', risk: 'Высокий', roi: '45%', date: '2 ноя', status: 'new' },
  { id: 2, title: 'Облигации ОФЗ', category: 'Облигации', risk: 'Низкий', roi: '8%', date: '1 ноя', status: 'analyzed' },
  { id: 3, title: 'Bitcoin долгосрочно', category: 'Крипто', risk: 'Средний', roi: '120%', date: '1 ноя', status: 'new' },
  { id: 4, title: 'Коммерческая недвижимость', category: 'Недвижимость', risk: 'Средний', roi: '15%', date: '31 окт', status: 'analyzed' },
];

const activityData = [
  { date: '27 окт', cases: 12 },
  { date: '28 окт', cases: 19 },
  { date: '29 окт', cases: 15 },
  { date: '30 окт', cases: 28 },
  { date: '31 окт', cases: 23 },
  { date: '1 ноя', cases: 34 },
  { date: '2 ноя', cases: 41 },
];

const categoryData = [
  { name: 'Акции', value: 35, color: '#9b87f5' },
  { name: 'Крипто', value: 25, color: '#0EA5E9' },
  { name: 'Недвижимость', value: 20, color: '#22c55e' },
  { name: 'Стартапы', value: 15, color: '#f59e0b' },
  { name: 'Облигации', value: 5, color: '#ef4444' },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-[600px]">
            <TabsTrigger value="dashboard" className="gap-2">
              <Icon name="LayoutDashboard" size={16} />
              <span className="hidden sm:inline">Дашборд</span>
            </TabsTrigger>
            <TabsTrigger value="channels" className="gap-2">
              <Icon name="Radio" size={16} />
              <span className="hidden sm:inline">Каналы</span>
            </TabsTrigger>
            <TabsTrigger value="parsing" className="gap-2">
              <Icon name="Search" size={16} />
              <span className="hidden sm:inline">Парсинг</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <Icon name="TrendingUp" size={16} />
              <span className="hidden sm:inline">Аналитика</span>
            </TabsTrigger>
            <TabsTrigger value="export" className="gap-2">
              <Icon name="Download" size={16} />
              <span className="hidden sm:inline">Экспорт</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <DashboardTab 
              activityData={activityData}
              categoryData={categoryData}
              mockCases={mockCases}
            />
          </TabsContent>

          <TabsContent value="channels">
            <ChannelsTab 
              mockChannels={mockChannels}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </TabsContent>

          <TabsContent value="parsing">
            <ParsingTab />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsTab />
          </TabsContent>

          <TabsContent value="export">
            <ExportTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
