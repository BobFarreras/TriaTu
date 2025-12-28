export type Locale = 'ca' | 'es' | 'en';

export const dictionaries = {
  ca: {
    common: {
      loading: 'Pensant...',
      error: 'Alguna cosa ha anat malament',
      start_over: 'Tornar a començar',
      switch_lang: 'Canviar idioma'
    },
    decision: {
      title: 'Què hauria de fer?',
      energy_label: 'Nivell d\'Energia',
      time_label: 'Temps disponible (min)',
      low_energy: 'Baixa energia (vull alguna cosa fàcil)',
      high_energy: 'Alta energia (puc cuinar/viatjar)',
      button: 'Decideix per mi',
      result_title: 'La decisió és...'
    },
    room: {
      create_title: 'Crear Sala de Decisió',
      join_title: 'Unir-se a una sala',
      room_name: 'Nom de la sala',
      host_name: 'El teu nom',
      create_btn: 'Crear Sala',
      waiting: 'Esperant participants...',
      participants: 'Participants',
      resolve_btn: 'Resoldre Decisió',
      share_link: 'Comparteix aquest ID:',
      status_open: 'OBERTA',
      status_resolved: 'RESOLTA',
      // NOVES CLAUS
      history_title: 'Historial de Decisions',
      make_decision_title: 'Prendre Nova Decisió',
      mode_magic: 'Màgic (Basat en gustos)',
      mode_candidates: 'Llista d\'Opcions',
      candidate_placeholder: 'Afegir opció (ex: Pizzeria)',
      add_btn: 'Afegir',
      decide_btn: 'Decidir ara!',
      no_history: 'Encara no s\'ha pres cap decisió.',
      candidates_list: 'Opcions proposades:'
    }
  },
  es: {
    common: {
      loading: 'Pensando...',
      error: 'Algo salió mal',
      start_over: 'Empezar de nuevo',
      switch_lang: 'Cambiar idioma'
    },
    decision: {
      title: '¿Qué debería hacer?',
      energy_label: 'Nivel de Energía',
      time_label: 'Tiempo disponible (min)',
      low_energy: 'Baja energía (quiero algo fácil)',
      high_energy: 'Alta energía (puedo cocinar/viajar)',
      button: 'Decide por mí',
      result_title: 'La decisión es...'
    },
    room: {
      create_title: 'Crear Sala de Decisión',
      join_title: 'Unirse a una sala',
      room_name: 'Nombre de la sala',
      host_name: 'Tu nombre',
      create_btn: 'Crear Sala',
      waiting: 'Esperando participantes...',
      participants: 'Participantes',
      resolve_btn: 'Resolver Decisión',
      share_link: 'Comparte este ID:',
      status_open: 'ABIERTA',
      status_resolved: 'RESUELTA',
      // NOVES CLAUS
      history_title: 'Historial de Decisiones',
      make_decision_title: 'Tomar Nueva Decisión',
      mode_magic: 'Mágico (Basado en gustos)',
      mode_candidates: 'Lista de Opciones',
      candidate_placeholder: 'Añadir opción (ej: Pizzería)',
      add_btn: 'Añadir',
      decide_btn: '¡Decidir ahora!',
      no_history: 'Todavía no hay decisiones.',
      candidates_list: 'Opciones propuestas:'
    }
  },
  en: {
    common: {
      loading: 'Thinking...',
      error: 'Something went wrong',
      start_over: 'Start Over',
      switch_lang: 'Switch Language'
    },
    decision: {
      title: 'What should I do?',
      energy_label: 'Energy Level',
      time_label: 'Available Time (min)',
      low_energy: 'Low energy (I want something easy)',
      high_energy: 'High energy (I can cook/travel)',
      button: 'Decide for me',
      result_title: 'The decision is...'
    },
    room: {
      create_title: 'Create Decision Room',
      join_title: 'Join a Room',
      room_name: 'Room Name',
      host_name: 'Your Name',
      create_btn: 'Create Room',
      waiting: 'Waiting for participants...',
      participants: 'Participants',
      resolve_btn: 'Resolve Decision',
      share_link: 'Share this ID:',
      status_open: 'OPEN',
      status_resolved: 'RESOLVED',
      // NOVES CLAUS
      history_title: 'Decision History',
      make_decision_title: 'Make New Decision',
      mode_magic: 'Magic (Taste based)',
      mode_candidates: 'Options List',
      candidate_placeholder: 'Add option (e.g. Pizza Place)',
      add_btn: 'Add',
      decide_btn: 'Decide now!',
      no_history: 'No decisions made yet.',
      candidates_list: 'Proposed options:'
    }
  }
};