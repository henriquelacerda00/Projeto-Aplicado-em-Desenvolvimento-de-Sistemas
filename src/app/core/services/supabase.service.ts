import { environment } from './../../../environments/environment.development';
import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { PhysicalAssessment } from '../types/tables.interface';
import { tableQuerys } from './tableQuerys';

export interface AnaliseUnificada {
  id: string;
  name: string;
  date: string;
  _table: string;
}

const safeStorage =
  typeof window !== 'undefined'
    ? window.sessionStorage
    : {
      getItem: () => null,
      setItem: () => { },
      removeItem: () => { },
    };

const supabase = createClient(environment.supabaseUrl, environment.supabaseKey, {
  auth: {
    storage: safeStorage as any,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  constructor() { }

  async signUp(nome: string, email: string, senha: string, tipoUsuario: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: {
        emailRedirectTo: 'https://cva-data.vercel.app/auth/callback',
        data: {
          full_name: nome,
          tipoUsuario: tipoUsuario,
        },
      },
    });

    return { data, error };
  }

  signIn(email: string, senha: string) {
    return supabase.auth.signInWithPassword({
      email,
      password: senha,
    });
  }

  async getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Erro ao buscar usuário:', error);
      return null;
    }
    return data.user;
  }

  async getUserData() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) return null;

    return {
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.['name'] ?? '',
      role: user.role ?? null,
    };
  }

  onAuthStateChange(callback: (event: string, session: any) => void) {
    supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  }

  signOut() {
    localStorage.clear();
    sessionStorage.clear();
    return supabase.auth.signOut();
  }

  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: { prompt: 'consent' },
        redirectTo: 'http://cva-data.vercel.app',
      },
    });

    if (error) {
      console.error('Erro no login Google:', error.message);
      throw error;
    }

    return data;
  }

  async waitForSession(timeoutMs = 5000): Promise<any> {
    const start = Date.now();
    let session = null;

    while (!session) {
      const { data } = await supabase.auth.getSession();
      session = data.session;

      if (session) return session;

      if (Date.now() - start > timeoutMs) {
        throw new Error('Timeout aguardando sessão');
      }

      await new Promise((r) => setTimeout(r, 100));
    }
  }

  async acceptSessionInvite(token: string) {
    const { data, error } = await supabase.functions.invoke('accept-session-invite', {
      body: { token },
    });

    if (error) {
      console.error('Erro ao aceitar convite:', error);
      throw error;
    }

    return data;
  }

  getSession() {
    return supabase.auth.getSession();
  }

  async recuperarSenha(email: string) {

    const response = await fetch(
      `${environment.supabaseUrl}/functions/v1/recovery-password`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',

          apikey: environment.supabaseKey,

          Authorization:
            `Bearer ${environment.supabaseKey}`,
        },

        body: JSON.stringify({
          email
        }),
      }
    );

    return response.json();
  }

  async refreshSession() {
    await supabase.auth.refreshSession();
  }

  async updateUserProfile(fullName?: string, email?: string, password?: string): Promise<boolean> {
    const payload: any = {};

    if (email) payload.email = email;
    if (password) payload.password = password;
    if (fullName) payload.data = { name: fullName };

    const { error } = await supabase.auth.updateUser(payload);

    if (error) {
      console.error(error);
      return false;
    }

    return true;
  }

  updateUserPassword({ password }: { password: string }) {
    return supabase.auth.updateUser({
      password,
    });
  }

  async updateUserData(userId: string, fullName: string, email: string): Promise<boolean> {
    const { error } = await supabase.from('users').update({ full_name: fullName, email }).eq('id', userId);

    if (error) {
      console.error('Erro ao atualizar usuário:', error);
      return false;
    }

    return true;
  }

  async getDataById(table: string, id: string) {
    const { data, error } = await supabase.from(table).select('*').eq('id', id).single();

    if (error) {
      console.error(`Erro ao buscar dados em ${table}:`, error.message);
      return null;
    }

    return data;
  }

  async insertPhysicalAssessment(data: Partial<PhysicalAssessment>) {
    const { data: result, error } = await supabase.from('physical_assessments').insert([data]);

    if (error) {
      console.error('Erro ao inserir avaliação física:', error.message);
      throw error;
    }

    return result;
  }

  async insertSizeTableData(data: any) {
    const { data: result, error } = await supabase.from('size_table').insert([data]);

    if (error) {
      console.error('Erro ao inserir dados da tabela de tamanhos:', error.message);
      console.error('Detalhes:', error.details);
      throw error;
    }

    return result;
  }

  async getCurrentUserId(): Promise<string | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return user ? user.id : null;
  }

  async insertData(table: string, data: any | any[]) {
    const payload = Array.isArray(data) ? data : [data];
    const { error } = await supabase.from(table).insert(payload);

    if (error) throw error;
    return true;
  }

  async upsertData(table: string, data: any) {
    try {
      const { data: upserted, error } = await supabase
        .from(table)
        .upsert([data], { onConflict: 'user_id,sample_number' })
        .select();

      if (error) {
        console.error(`Erro ao fazer upsert em ${table}:`, error);
        throw error;
      }

      return upserted;
    } catch (err: any) {
      console.error(`Erro inesperado no upsert em ${table}:`, err.message);
      throw err;
    }
  }

  async createSession(name: string) {
    const userId = await this.getCurrentUserId();

    const { data, error } = await supabase
      .from('session')
      .insert({
        name,
        owner: userId,
        status: 'active',
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar sessão:', error);
      throw error;
    }

    return data;
  }

  async updateSessionStatus(sessionId: string, status: 'active' | 'inactive') {
    const { data, error } = await supabase
      .from('session')
      .update({ status })
      .eq('id', sessionId)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Erro ao atualizar status:', error);
      throw error;
    }

    return data;
  }

  async inactivateSession(sessionId: string) {
    return this.updateSessionStatus(sessionId, 'inactive');
  }

  async reactivateSession(sessionId: string) {
    return this.updateSessionStatus(sessionId, 'active');
  }

  async createSessionSamples(sessionId: string, samples: string[]) {
    const payload = samples.map((sample) => ({
      session_id: sessionId,
      sample_number: sample,
    }));

    const { data, error } = await supabase.from('session_samples').insert(payload).select();

    if (error) {
      console.error('Erro ao criar session_samples:', error);
      throw error;
    }

    return data;
  }

  async sendSessionInvites(sessionId: string, emails: string[]) {
    const { error } = await supabase.functions.invoke('send-session-invite', {
      body: {
        session_id: sessionId,
        emails,
      },
    });

    if (error) {
      console.error('Erro ao enviar convites:', error);
      throw error;
    }
  }

  async getSamplesBySession(sessionId: string) {
    const { data, error } = await supabase
      .from('session_samples')
      .select('*')
      .eq('session_id', sessionId)
      .order('sample_number', { ascending: true });

    if (error) throw error;
    return data ?? [];
  }

  async getSessionName(sessionId: string) {
    const { data, error } = await supabase.from('session').select('name').eq('id', sessionId).maybeSingle();

    if (error) {
      console.error('Erro ao buscar sessão:', error);
      return null;
    }

    return data?.name ?? null;
  }

  async getSessionById(sessionId: string) {
    const { data, error } = await supabase.from('session').select('*').eq('id', sessionId).single();

    if (error) {
      console.error('Erro ao buscar sessão:', error);
      throw error;
    }

    return data;
  }

  async updateSession(sessionId: string, payload: { name?: string }) {
    const { data, error } = await supabase.from('session').update(payload).eq('id', sessionId).select().single();

    if (error) {
      console.error('Erro ao atualizar sessão:', error);
      throw error;
    }

    return data;
  }

  async getQGradersBySession(sessionId: string) {
    const { data, error } = await supabase
      .from('session_qgraders')
      .select(
        `
        qgrader_id,
        users:qgrader_id (
          email
        )
      `,
      )
      .eq('session_id', sessionId);

    if (error) {
      console.error('Erro ao buscar q-graders da sessão:', error);
      throw error;
    }

    return data ?? [];
  }

  async getInvitedQGradersBySession(sessionId: string) {
    const { data, error } = await supabase.from('session_invitations').select('email').eq('session_id', sessionId);

    if (error) {
      console.error('Erro ao buscar convites da sessão:', error);
      throw error;
    }

    return data ?? [];
  }

  async getAllSessionQGradersEmails(sessionId: string): Promise<string[]> {
    const invited = await this.getInvitedQGradersBySession(sessionId);
    const accepted = await this.getQGradersBySession(sessionId);

    const invitedEmails = (invited ?? []).map((item: any) => item.email).filter(Boolean);
    const acceptedEmails = (accepted ?? []).map((item: any) => item.users?.email).filter(Boolean);

    return [...new Set([...invitedEmails, ...acceptedEmails])];
  }

  async createMissingSessionSamples(sessionId: string, samples: string[]) {
    const existingSamples = await this.getSamplesBySession(sessionId);

    const existingMap = new Map<string, any>();
    for (const sample of existingSamples ?? []) {
      existingMap.set(String(sample.sample_number), sample);
    }

    const missingSamples = samples.filter((sampleNumber) => !existingMap.has(String(sampleNumber)));

    let createdSamples: any[] = [];
    if (missingSamples.length > 0) {
      createdSamples = await this.createSessionSamples(sessionId, missingSamples);
    }

    return [...(existingSamples ?? []), ...createdSamples];
  }

  async listMySessionsWithSamples() {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('Usuário não autenticado');
    }

    const { data: userData, error: roleError } = await supabase.from('users').select('role').eq('id', user.id).single();

    if (roleError || !userData) {
      throw roleError || new Error('Não foi possível identificar o tipo de usuário');
    }

    const role = userData.role;

    let ownedSessions: any[] = [];
    let invitedSessions: any[] = [];

    if (role === 'P') {
      const { data, error } = await supabase
        .from('session')
        .select(
          `
          id,
          name,
          created_at,
          owner,
          status,
          session_samples (
            id,
            sample_number
          )
        `,
        )
        .eq('owner', user.id);

      if (error) throw error;
      ownedSessions = data ?? [];
    }

    const { data: qgraderLinks, error: qgraderError } = await supabase
      .from('session_qgraders')
      .select(
        `
        session:session_id (
          id,
          name,
          created_at,
          owner,
          status,
          session_samples (
            id,
            sample_number
          )
        )
      `,
      )
      .eq('qgrader_id', user.id);

    if (qgraderError) throw qgraderError;

    invitedSessions = (qgraderLinks ?? []).map((link: any) => link.session).filter(Boolean);

    const sessionMap = new Map<string, any>();

    [...ownedSessions, ...invitedSessions].forEach((session: any) => {
      sessionMap.set(String(session.id), session);
    });

    return Array.from(sessionMap.values()).sort(
      (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }

  async listMySessionsWithSamplesByStatus(status: 'active' | 'inactive') {
    const allSessions = await this.listMySessionsWithSamples();

    return (allSessions ?? []).filter((session: any) => {
      if (status === 'active') {
        return !session.status || session.status === 'active';
      }

      return session.status === 'inactive';
    });
  }

  async listActiveSessionsWithSamples() {
    return this.listMySessionsWithSamplesByStatus('active');
  }

  async listInactiveSessionsWithSamples() {
    return this.listMySessionsWithSamplesByStatus('inactive');
  }

  async getExtrisincFormsBySession(sessionId: string) {
    const { data, error } = await supabase
      .from('extrisinc_forms')
      .select('*')
      .eq('session_id', sessionId)
      .order('session_sample_id', { ascending: true });

    if (error) {
      console.error('Erro ao buscar extrisinc_forms da sessão:', error);
      throw error;
    }

    return data ?? [];
  }

  async getSentSamplesByTables(tables: string[], userId: string) {
    const results = await Promise.all(
      tables.map(async (table) => {
        const isTypedTable = ['fragrance_data', 'aroma_data', 'beverage_data'].includes(table);

        const selectFields = isTypedTable ? 'session_sample_id, form_type' : 'session_sample_id';

        const { data, error } = await supabase.from(table).select(selectFields).eq('user_id', userId);

        if (error) throw error;

        return { table, data, isTypedTable };
      }),
    );

    const map: Record<string, Set<number> | Map<string, Set<number>>> = {};

    results.forEach(({ table, data, isTypedTable }) => {
      if (isTypedTable) {
        const typeMap = new Map<string, Set<number>>();

        (data ?? []).forEach((row: any) => {
          const type = row.form_type;
          const id = Number(row.session_sample_id);

          if (!typeMap.has(type)) {
            typeMap.set(type, new Set<number>());
          }

          typeMap.get(type)!.add(id);
        });

        map[table] = typeMap;
      } else {
        map[table] = new Set<number>((data ?? []).map((row: any) => Number(row.session_sample_id)));
      }
    });

    return map;
  }

  async getAllAnalysesByUser() {
    const tables = [
      {
        name: 'physical_assessments',
        type: 'Physical',
        sampleField: 'sample_number',
        notesField: 'notes',
        query: tableQuerys.Physical,
      },
      {
        name: 'size_table',
        type: 'Size',
        sampleField: 'sample_number',
        notesField: 'notes',
        query: tableQuerys.Size,
      },
      {
        name: 'affective_form',
        type: 'Affective',
        sampleField: 'sample_number',
        notesField: 'notes',
        query: tableQuerys.Affective,
      },
      {
        name: 'descriptive_form',
        type: 'Descriptive',
        sampleField: 'sample_number',
        notesField: 'notes',
        query: tableQuerys.Descriptive,
      },
      {
        name: 'extrisinc_forms',
        type: 'Extrisinc',
        sampleField: 'sample_number',
        notesField: 'notes',
        query: tableQuerys.Extrisinc,
      },
    ];

    const allDataRaw: any[] = [];
    const userId = await this.getCurrentUserId();

    if (!userId) return [];

    for (const table of tables) {
      const { data, error } = await supabase.from(table.name).select(table.query).eq('user_id', userId);

      if (error) {
        console.error(`Erro ao buscar ${table.name}:`, error);
        continue;
      }

      if (!data) continue;

      allDataRaw.push({
        tableName: table.name,
        tableType: table.type,
        data,
      });
    }

    return allDataRaw;
  }

  async getAllAnalysesByUserIncludingInvites() {
    const userId = await this.getCurrentUserId();
    if (!userId) return [];

    const { data: qgraderLinks } = await supabase
      .from('session_qgraders')
      .select('session_id')
      .eq('qgrader_id', userId);

    const invitedSessionIds = (qgraderLinks ?? []).map((link: any) => link.session_id);

    const tables = [
      { name: 'physical_assessments', type: 'Physical', query: tableQuerys.Physical },
      { name: 'size_table', type: 'Size', query: tableQuerys.Size },
      { name: 'affective_form', type: 'Affective', query: tableQuerys.Affective },
      { name: 'descriptive_form', type: 'Descriptive', query: tableQuerys.Descriptive },
      { name: 'extrisinc_forms', type: 'Extrisinc', query: tableQuerys.Extrisinc },
    ];

    const allDataRaw: any[] = [];

    for (const table of tables) {
      const hasInvites = invitedSessionIds.length > 0;
      const query = supabase.from(table.name).select(table.query);

      const { data, error } = hasInvites
        ? await query.or(`user_id.eq.${userId},session_id.in.(${invitedSessionIds.join(',')})`)
        : await query.eq('user_id', userId);

      if (error) {
        console.error(`Erro ao buscar ${table.name}:`, error);
        continue;
      }

      if (!data?.length) continue;

      allDataRaw.push({
        tableName: table.name,
        tableType: table.type,
        data,
      });
    }

    return allDataRaw;
  }

  sanitizeExtrisincPayload(payload: Record<string, any>) {
    const sanitized: Record<string, any> = {};

    for (const [key, value] of Object.entries(payload)) {
      if (value === false) {
        sanitized[key] = null;
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  async findExtrisincFormBySessionAndSample(sessionId: string, sampleNumber: string) {
    const { data, error } = await supabase
      .from('extrisinc_forms')
      .select('id')
      .eq('session_id', sessionId)
      .eq('sample_number', sampleNumber)
      .maybeSingle();

    if (error) {
      console.error('Erro ao buscar extrisinc_form existente:', error);
      throw error;
    }

    return data ?? null;
  }

  async saveSessionExtrisincForm(sessionId: string, sampleNumber: string, payload: any) {
    const sanitizedPayload = this.sanitizeExtrisincPayload(payload);
    const existing = await this.findExtrisincFormBySessionAndSample(sessionId, sampleNumber);

    if (existing?.id) {
      const updated = await this.updateExtrisincFormById(existing.id, sanitizedPayload);

      if (updated) {
        return updated;
      }

      const { data: insertedAfterMiss, error: insertAfterMissError } = await supabase
        .from('extrisinc_forms')
        .insert(sanitizedPayload)
        .select()
        .single();

      if (insertAfterMissError) {
        console.error('Erro ao inserir extrisinc_form após update sem retorno:', insertAfterMissError);
        throw insertAfterMissError;
      }

      return insertedAfterMiss;
    }

    const { data, error } = await supabase.from('extrisinc_forms').insert(sanitizedPayload).select().single();

    if (error) {
      console.error('Erro ao inserir extrisinc_form:', error);
      throw error;
    }

    return data;
  }
  normalizeExtrisincBooleans(payload: Record<string, any>) {
    const normalized: Record<string, any> = {};

    for (const [key, value] of Object.entries(payload)) {
      if (typeof value === 'boolean') {
        normalized[key] = value ? 1 : 0;
      } else {
        normalized[key] = value;
      }
    }

    return normalized;
  }

  normalizeEmails(emails: string[]): string[] {
    return [...new Set((emails ?? []).map((email) => email?.trim().toLowerCase()).filter(Boolean))];
  }

  async createMissingSessionInvites(sessionId: string, emails: string[]) {
    const normalizedEmails = this.normalizeEmails(emails);

    const existingInvites = await this.getInvitedQGradersBySession(sessionId);
    const existingAccepted = await this.getQGradersBySession(sessionId);

    const existingInviteEmails = new Set(
      (existingInvites ?? []).map((item: any) => item.email?.trim().toLowerCase()).filter(Boolean),
    );

    const existingAcceptedEmails = new Set(
      (existingAccepted ?? []).map((item: any) => item.users?.email?.trim().toLowerCase()).filter(Boolean),
    );

    const newEmails = normalizedEmails.filter(
      (email) => !existingInviteEmails.has(email) && !existingAcceptedEmails.has(email),
    );

    if (newEmails.length > 0) {
      await this.sendSessionInvites(sessionId, newEmails);
    }

    return newEmails;
  }

  async findLatestExtrisincFormBySessionSample(sessionSampleId: number) {
    const { data, error } = await supabase
      .from('extrisinc_forms')
      .select('id, created_at')
      .eq('session_sample_id', sessionSampleId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Erro ao buscar extrisinc_form por session_sample_id:', error);
      throw error;
    }

    return data ?? null;
  }

  async updateExtrisincFormById(id: number, payload: any) {
    const { data, error } = await supabase.from('extrisinc_forms').update(payload).eq('id', id).select().single();

    if (error) {
      console.error('Erro ao atualizar extrisinc_form:', error);
      throw error;
    }

    return data;
  }

  async insertExtrisincForm(payload: any) {
    const { data, error } = await supabase.from('extrisinc_forms').insert(payload).select().single();

    if (error) {
      console.error('Erro ao inserir extrisinc_form:', error);
      throw error;
    }

    return data;
  }

  async saveSessionExtrisincFormBySessionSample(sessionSampleId: number, payload: any) {
    const { data, error } = await supabase
      .from('extrisinc_forms')
      .upsert(
        {
          ...payload,
          session_sample_id: sessionSampleId,
        },
        {
          onConflict: 'session_id,session_sample_id'
        },
      )
      .select()
      .single();

    if (error) {
      console.error('Erro no upsert extrisinc:', error);
      throw error;
    }

    return data;
  }
}
