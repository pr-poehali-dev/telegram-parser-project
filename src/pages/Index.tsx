import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon name="Radio" className="text-primary" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold">TG Parser</h1>
                <p className="text-xs text-muted-foreground">Мониторинг инвестиционных каналов</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Онлайн
              </Badge>
            </div>
          </div>
        </div>
      </div>

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

          <TabsContent value="dashboard" className="space-y-6 animate-fade-in">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="hover-scale">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Всего каналов</CardTitle>
                  <Icon name="Radio" className="text-muted-foreground" size={16} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground mt-1">+3 за неделю</p>
                </CardContent>
              </Card>
              <Card className="hover-scale">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Собрано кейсов</CardTitle>
                  <Icon name="FileText" className="text-muted-foreground" size={16} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">3,205</div>
                  <p className="text-xs text-muted-foreground mt-1">+412 сегодня</p>
                </CardContent>
              </Card>
              <Card className="hover-scale">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Активных парсеров</CardTitle>
                  <Icon name="Activity" className="text-muted-foreground" size={16} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">18</div>
                  <p className="text-xs text-muted-foreground mt-1">75% активности</p>
                </CardContent>
              </Card>
              <Card className="hover-scale">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ср. доходность</CardTitle>
                  <Icon name="TrendingUp" className="text-muted-foreground" size={16} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">28.5%</div>
                  <p className="text-xs text-muted-foreground mt-1">По всем кейсам</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Активность парсинга</CardTitle>
                  <CardDescription>Собранные кейсы за последнюю неделю</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={activityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="date" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1a1f2c', border: '1px solid #333' }}
                        labelStyle={{ color: '#fff' }}
                      />
                      <Line type="monotone" dataKey="cases" stroke="#9b87f5" strokeWidth={3} dot={{ fill: '#9b87f5', r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Категории инвестиций</CardTitle>
                  <CardDescription>Распределение по типам кейсов</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1a1f2c', border: '1px solid #333' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Последние кейсы</CardTitle>
                <CardDescription>Новые инвестиционные предложения</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockCases.map((case_) => (
                    <div key={case_.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon name="TrendingUp" className="text-primary" size={20} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{case_.title}</h4>
                            {case_.status === 'new' && <Badge variant="secondary" className="text-xs">Новый</Badge>}
                          </div>
                          <p className="text-xs text-muted-foreground">{case_.category} • {case_.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm font-medium text-green-500">{case_.roi}</div>
                          <div className="text-xs text-muted-foreground">{case_.risk}</div>
                        </div>
                        <Button size="sm" variant="ghost">
                          <Icon name="ExternalLink" size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="channels" className="space-y-6 animate-fade-in">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Управление каналами</CardTitle>
                    <CardDescription>Добавляйте и настраивайте источники данных</CardDescription>
                  </div>
                  <Button className="gap-2">
                    <Icon name="Plus" size={16} />
                    Добавить канал
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Input 
                    placeholder="Поиск каналов..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
                <div className="space-y-3">
                  {mockChannels.map((channel) => (
                    <div key={channel.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                          {channel.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{channel.name}</h4>
                            <Badge variant={channel.active ? 'default' : 'secondary'}>
                              {channel.active ? 'Активен' : 'Остановлен'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {channel.members.toLocaleString()} подписчиков • {channel.parsed} кейсов • {channel.category}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost">
                          <Icon name="Settings" size={16} />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Icon name="MoreVertical" size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="parsing" className="space-y-6 animate-fade-in">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Фильтры парсинга</CardTitle>
                  <CardDescription>Настройте автоматический сбор данных</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Ключевые слова</label>
                    <Input placeholder="инвестиции, ROI, доходность..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Категории</label>
                    <div className="flex flex-wrap gap-2">
                      {['Акции', 'Крипто', 'Недвижимость', 'Стартапы', 'Облигации'].map((cat) => (
                        <Badge key={cat} variant="outline" className="cursor-pointer hover:bg-primary/20">
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Минимальная доходность (%)</label>
                    <Input type="number" placeholder="10" />
                  </div>
                  <Button className="w-full">Применить фильтры</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Расписание парсинга</CardTitle>
                  <CardDescription>Автоматический сбор по времени</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <div className="flex items-center gap-3">
                        <Icon name="Clock" className="text-primary" size={20} />
                        <div>
                          <div className="font-medium">Каждые 2 часа</div>
                          <div className="text-xs text-muted-foreground">Основные каналы</div>
                        </div>
                      </div>
                      <Badge variant="default">Активно</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <div className="flex items-center gap-3">
                        <Icon name="Clock" className="text-muted-foreground" size={20} />
                        <div>
                          <div className="font-medium">Раз в день (09:00)</div>
                          <div className="text-xs text-muted-foreground">VIP каналы</div>
                        </div>
                      </div>
                      <Badge variant="secondary">Остановлено</Badge>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full gap-2">
                    <Icon name="Plus" size={16} />
                    Добавить расписание
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Текущий прогресс парсинга</CardTitle>
                <CardDescription>Сбор данных в реальном времени</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Инвестиции России</span>
                    <span className="text-muted-foreground">87%</span>
                  </div>
                  <Progress value={87} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Crypto Invest Pro</span>
                    <span className="text-muted-foreground">62%</span>
                  </div>
                  <Progress value={62} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Стартап Инвестиции</span>
                    <span className="text-muted-foreground">34%</span>
                  </div>
                  <Progress value={34} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6 animate-fade-in">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Лучшая категория</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Крипто</div>
                  <p className="text-xs text-muted-foreground mt-1">Средняя доходность 45.2%</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Высокорисковые</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">428</div>
                  <p className="text-xs text-muted-foreground mt-1">13% от всех кейсов</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Надежные</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,847</div>
                  <p className="text-xs text-muted-foreground mt-1">58% от всех кейсов</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Аналитика по доходности</CardTitle>
                <CardDescription>Распределение кейсов по уровню ROI</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { range: '0-10%', count: 450 },
                    { range: '10-25%', count: 890 },
                    { range: '25-50%', count: 1200 },
                    { range: '50-100%', count: 520 },
                    { range: '>100%', count: 145 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="range" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1a1f2c', border: '1px solid #333' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Bar dataKey="count" fill="#9b87f5" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="export" className="space-y-6 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>Экспорт данных</CardTitle>
                <CardDescription>Выгрузите собранные кейсы в удобном формате</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 md:grid-cols-3">
                  <Button variant="outline" className="h-24 flex-col gap-2">
                    <Icon name="FileSpreadsheet" size={32} className="text-green-500" />
                    <span>Excel (.xlsx)</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex-col gap-2">
                    <Icon name="FileText" size={32} className="text-blue-500" />
                    <span>CSV (.csv)</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex-col gap-2">
                    <Icon name="Braces" size={32} className="text-purple-500" />
                    <span>JSON (.json)</span>
                  </Button>
                </div>

                <div className="space-y-3 pt-4">
                  <h4 className="font-medium">Параметры экспорта</h4>
                  <div className="space-y-2">
                    <label className="text-sm">Период</label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">Категории</label>
                    <div className="flex flex-wrap gap-2">
                      {['Все', 'Акции', 'Крипто', 'Недвижимость', 'Стартапы'].map((cat) => (
                        <Badge key={cat} variant="outline" className="cursor-pointer hover:bg-primary/20">
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button className="w-full gap-2 mt-4">
                    <Icon name="Download" size={16} />
                    Скачать данные
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>История экспортов</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { date: '2 ноя 2024, 14:23', format: 'Excel', size: '2.4 MB', records: 3205 },
                    { date: '1 ноя 2024, 09:15', format: 'CSV', size: '1.1 MB', records: 2893 },
                    { date: '31 окт 2024, 18:45', format: 'JSON', size: '3.8 MB', records: 2654 },
                  ].map((exp, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <div className="flex items-center gap-3">
                        <Icon name="FileDown" className="text-muted-foreground" size={20} />
                        <div>
                          <div className="font-medium">{exp.format}</div>
                          <div className="text-xs text-muted-foreground">{exp.date} • {exp.records.toLocaleString()} записей</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{exp.size}</span>
                        <Button size="sm" variant="ghost">
                          <Icon name="Download" size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
