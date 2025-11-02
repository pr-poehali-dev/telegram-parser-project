import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

const ExportTab = () => {
  return (
    <div className="space-y-6 animate-fade-in">
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
    </div>
  );
};

export default ExportTab;
