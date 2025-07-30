import { Card, CardHeader } from '@/components/ui/card';

export default function GroupCard({ _id, name, members, onClick }){
  return (
    <Card onClick={onClick} className="cursor-pointer hover:shadow-sm">
      <CardHeader className="flex justify-between">
        <span className="font-medium">{name}</span>
        <span className="text-sm text-muted-foreground">
          {members.length} ppl
        </span>
      </CardHeader>
    </Card>
  );
}
