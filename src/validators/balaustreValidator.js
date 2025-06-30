import * as yup from "yup";

// Schema de validação para o formulário de edição do Balaústre
export const balaustreValidationSchema = yup.object().shape({
  // Detalhes da Sessão
  NumeroBalaustre: yup
    .string()
    .required("O número do balaústre é obrigatório."),
  ClasseSessao: yup.string().required("A classe da sessão é obrigatória."),
  DiaSessao: yup.string().required("A data da sessão é obrigatória."),
  HoraInicioSessao: yup.string().required("A hora de início é obrigatória."),
  HoraEncerramento: yup
    .string()
    .required("A hora de encerramento é obrigatória."),
  DataAssinatura: yup.string().required("A data da assinatura é obrigatória."),
  DataSessaoAnterior: yup
    .string()
    .required("A data da sessão anterior é obrigatória."),

  // Oficiais
  Veneravel: yup.string().required("O Venerável Mestre é obrigatório."),
  PrimeiroVigilante: yup.string().required("O 1º Vigilante é obrigatório."),
  SegundoVigilante: yup.string().required("O 2º Vigilante é obrigatório."),
  Orador: yup.string().required("O Orador é obrigatório."),
  Secretario: yup.string().required("O Secretário é obrigatório."),
  Tesoureiro: yup.string().required("O Tesoureiro é obrigatório."),
  Chanceler: yup.string().required("O Chanceler é obrigatório."),

  // --- CAMPOS ADICIONADOS ---
  NumeroIrmaosQuadro: yup
    .number()
    .required("O número de irmãos do quadro é obrigatório.")
    .typeError("Deve ser um número."),
  NumeroVisitantes: yup
    .number()
    .required("O número de visitantes é obrigatório.")
    .typeError("Deve ser um número."),
  // --- FIM DA ADIÇÃO ---

  // Opções e Conteúdo
  EmendasBalaustreAnterior: yup
    .string()
    .oneOf(["com", "sem"])
    .required("É obrigatório indicar se houve emendas."),
  TroncoBeneficiencia: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required("O valor do tronco é obrigatório.")
    .typeError("O valor do tronco deve ser um número."),

  // Campos de texto livre
  ExpedienteRecebido: yup.string().required("Este campo é obrigatório."),
  ExpedienteExpedido: yup.string().required("Este campo é obrigatório."),
  SacoProposta: yup.string().required("Este campo é obrigatório."),
  OrdemDia: yup.string().required("Este campo é obrigatório."),
  Escrutinio: yup.string().required("Este campo é obrigatório."),
  TempoInstrucao: yup.string().required("Este campo é obrigatório."),
  Palavra: yup.string().required("Este campo é obrigatório."),
  Emendas: yup.string().nullable(),
});
