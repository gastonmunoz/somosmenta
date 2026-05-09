const steps = [
  {
    num: "01",
    name: "Escuchamos",
    desc: "Entendemos tu empresa, tu cultura y los objetivos del evento antes de proponer cualquier cosa.",
  },
  {
    num: "02",
    name: "Diseñamos",
    desc: "Creamos la propuesta a medida: concepto, presupuesto, proveedores y cronograma.",
  },
  {
    num: "03",
    name: "Conectamos",
    desc: "Gestionamos cada proveedor para que vos no tengas que hablar con nadie más.",
  },
  {
    num: "04",
    name: "Ejecutamos",
    desc: "Estamos presentes el día del evento, de principio a fin, para que todo salga perfecto.",
  },
];

export default function Process() {
  return (
    <section id="proceso" className="bg-[#F5F5F3] py-20 md:py-24 px-8 md:px-12">
      <div className="max-w-6xl mx-auto">
        <p className="text-[10px] tracking-[4px] uppercase text-[#5D8A6B] mb-3">
          Cómo trabajamos
        </p>
        <h2
          className="text-3xl md:text-4xl font-normal text-[#1A1A1A] mb-14"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          El enfoque Menta
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">
          {steps.map((step) => (
            <div key={step.num}>
              <p
                className="text-[42px] font-normal leading-none mb-3 text-[#EAF0EC]"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {step.num}
              </p>
              <p className="text-[13px] font-medium text-[#1A1A1A] tracking-[1px] mb-2">
                {step.name}
              </p>
              <p className="text-[11px] text-[#888888] leading-[1.7] font-light">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
