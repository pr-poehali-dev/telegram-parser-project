import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Case {
  id: number;
  title: string;
  category: string;
  risk: string;
  roi: string;
  date: string;
  status: string;
}

interface DashboardTabProps {
  activityData: Array<{ date: string; cases: number }>;
  categoryData: Array<{ name: string; value: number; color: string }>;
  mockCases: Case[];
}

const DashboardTab = ({ activityData, categoryData, mockCases }: DashboardTabProps) => {
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);

  return (
    <div className="space-y-6 animate-fade-in">
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
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => setSelectedCase(case_)}
                    title="Подробнее"
                  >
                    <Icon name="ExternalLink" size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedCase} onOpenChange={() => setSelectedCase(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedCase?.title}</DialogTitle>
            <DialogDescription>
              {selectedCase?.category} • {selectedCase?.date}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Доходность</div>
                <div className="text-2xl font-bold text-green-500">{selectedCase?.roi}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Риск</div>
                <div className="text-2xl font-bold">{selectedCase?.risk}</div>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-accent/50">
              <p className="text-sm text-muted-foreground">
                Это пример инвестиционного кейса, собранного с Telegram каналов. 
                Здесь будет полное описание инвестиции, ссылки на источник и дополнительные данные.
              </p>
            </div>
            <Button className="w-full gap-2">
              <Icon name="ExternalLink" size={16} />
              Перейти к источнику
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardTab;