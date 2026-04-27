import InnerSearchForm from './InnerSearchForm.jsx';
import ProgressSteps from './ProgressSteps.jsx';
import './InnerHero.css';

export default function InnerHero({ step }) {
  return (
    <section className="inner-hero">
      <div className="container inner-hero__content">
        <InnerSearchForm />
      </div>

      <ProgressSteps currentStep={step} />
    </section>
  );
}