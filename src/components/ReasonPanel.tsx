type ReasonPanelProps = {
  reason: {
    title: string;
    body: string;
  };
};

export function ReasonPanel({ reason }: ReasonPanelProps) {
  return (
    <section className="reason-panel">
      <h2>{reason.title}</h2>
      <p>{reason.body}</p>
    </section>
  );
}
