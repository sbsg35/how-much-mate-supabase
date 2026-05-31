export default async function EditQuotePage({
  params,
}: {
  params: Promise<{ quote_id: string }>;
}) {
  const { quote_id } = await params;
  return <QuoteEditPage quoteId={quote_id} />;
}
