/**
 * Example Niche Input Data
 *
 * This file demonstrates how to structure niche input data for the
 * Webnova Programmatic SEO engine.
 */

import { NicheInput } from '../types';
import { generateSlug } from '../utils/slug';

/**
 * Example: Dental practice niche
 */
export const dentalPracticeNiche: NicheInput = {
  professionalSingular: 'Stomatolog',
  professionalPlural: 'Stomatologi',
  businessEntity: 'Cabinet Stomatologic',
  businessEntitySlug: generateSlug('Cabinet Stomatologic'),
  endClient: 'Pacienți cu dureri dentare și nevoi de îngrijire dentară',
  primaryPainPoint: 'Scaun gol și programări ratate în fiecare săptămână',
  technicalBenefit: 'Programări online 24/7 și vizibilitate pe Google Maps',
  relatedNiches: ['cabinet-veterinar', 'clinica-oftalmologie', 'cabinet-medicină-de-familie'],
};

/**
 * Example: Architecture firm niche
 */
export const architectureFirmNiche: NicheInput = {
  professionalSingular: 'Arhitect',
  professionalPlural: 'Arhitecți',
  businessEntity: 'Birou Arhitectură',
  businessEntitySlug: generateSlug('Birou Arhitectură'),
  endClient: 'Clienți care vor să construiască case sau să renoveze spații',
  primaryPainPoint: 'Proiecte întârziate și clienți care caută pe OLX',
  technicalBenefit: 'Portofoliu online și sistem de solicitare oferte automat',
  relatedNiches: ['birou-design-interior', 'firma-constructii', 'inginer-structurist'],
};

/**
 * Example: Veterinary clinic niche
 */
export const veterinaryClinicNiche: NicheInput = {
  professionalSingular: 'Veterinar',
  professionalPlural: 'Veterinari',
  businessEntity: 'Cabinet Veterinar',
  businessEntitySlug: generateSlug('Cabinet Veterinar'),
  endClient: 'Stăpâni de animale de companie cu urgențe sau controale de rutină',
  primaryPainPoint: 'Telefon ocupat constant și clienți care merg la concurență',
  technicalBenefit: 'Program de consultații online și notificări automate pentru vaccinări',
  relatedNiches: ['pet-shop', 'salon-toaletaj-canin', 'cabinet-stomatologic'],
};
