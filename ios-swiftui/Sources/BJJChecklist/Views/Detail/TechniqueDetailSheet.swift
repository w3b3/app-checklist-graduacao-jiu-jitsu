import SwiftUI

public struct TechniqueDetailSheet: View {
    @Environment(\.dismiss) private var dismiss
    let requirement: TechniqueRequirement
    let belt: Belt
    @Bindable var engine: ProgressEngine

    @State private var isCompleted: Bool
    @State private var notesText: String
    @State private var mediaUrlText: String

    public init(requirement: TechniqueRequirement, belt: Belt, engine: ProgressEngine) {
        self.requirement = requirement
        self.belt = belt
        self.engine = engine

        _isCompleted = State(initialValue: engine.isCompleted(for: requirement))
        _notesText = State(initialValue: engine.note(for: requirement))
        _mediaUrlText = State(initialValue: engine.mediaUrl(for: requirement))
    }

    /// Normalizes and validates the user-entered media URL.
    /// Safely handles URLs without schemes (e.g. "youtube.com/...") and prevents runtime crashes with invalid formats.
    public var validMediaURL: URL? {
        let trimmed = mediaUrlText.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return nil }

        var candidate = trimmed
        if !candidate.lowercased().hasPrefix("http://") && !candidate.lowercased().hasPrefix("https://") {
            candidate = "https://" + candidate
        }

        guard let url = URL(string: candidate),
              let scheme = url.scheme?.lowercased(),
              (scheme == "http" || scheme == "https"),
              let host = url.host,
              !host.isEmpty,
              host.contains(".") else {
            return nil
        }
        return url
    }

    public var body: some View {
        NavigationStack {
            Form {
                // Header & Info Section
                Section {
                    VStack(alignment: .leading, spacing: 8) {
                        Text(requirement.name)
                            .font(.title3.bold())
                            .foregroundColor(.primary)

                        HStack(spacing: 8) {
                            Text(belt.name)
                                .font(.caption.bold())
                                .padding(.horizontal, 8)
                                .padding(.vertical, 4)
                                .background(belt.color.opacity(0.15))
                                .foregroundColor(belt.color)
                                .clipShape(Capsule())

                            Text(requirement.category)
                                .font(.caption.weight(.semibold))
                                .padding(.horizontal, 8)
                                .padding(.vertical, 4)
                                .background(Color.appTertiarySystemFill)
                                .foregroundColor(.secondary)
                                .clipShape(Capsule())

                            Text(requirement.techniqueType.displayName)
                                .font(.caption)
                                .foregroundColor(.secondary)
                        }
                    }
                    .padding(.vertical, 4)

                    Toggle("Técnica Concluída", isOn: $isCompleted)
                        .tint(belt.color)
                        .accessibilityHint("Alterna a marcação de conclusão desta técnica")
                }

                // Notes Section
                Section {
                    VStack(alignment: .leading, spacing: 6) {
                        Text("Anotações Pessoais")
                            .font(.caption.bold())
                            .foregroundColor(.secondary)

                        TextEditor(text: $notesText)
                            .frame(minHeight: 120)
                            .overlay(
                                Group {
                                    if notesText.isEmpty {
                                        Text("Adicione detalhes sobre pegadas, variações, defesas ou observações do mestre...")
                                            .foregroundColor(.secondary.opacity(0.7))
                                            .padding(.top, 8)
                                            .padding(.leading, 4)
                                            .allowsHitTesting(false)
                                    }
                                },
                                alignment: .topLeading
                            )
                            .accessibilityLabel("Anotações pessoais da técnica")
                    }
                } header: {
                    Text("Suas Observações")
                }

                // Media URL Section
                Section {
                    VStack(alignment: .leading, spacing: 8) {
                        HStack {
                            Image(systemName: "link")
                                .foregroundColor(belt.color)
                            TextField("URL do vídeo (ex: YouTube, Instagram)", text: $mediaUrlText)
                                .autocorrectionDisabled()
                                #if os(iOS)
                                .textInputAutocapitalization(.never)
                                .keyboardType(.URL)
                                #endif
                                .accessibilityLabel("URL de referência do vídeo")
                        }

                        if let url = validMediaURL {
                            Link(destination: url) {
                                HStack {
                                    Label("Abrir Link no Navegador", systemImage: "arrow.up.right.square")
                                    Spacer()
                                }
                                .font(.subheadline.bold())
                                .foregroundColor(belt.color)
                            }
                            .padding(.top, 4)
                        } else if !mediaUrlText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
                            Text("Insira uma URL válida (ex: https://youtube.com/...)")
                                .font(.caption)
                                .foregroundColor(.red)
                                .padding(.top, 2)
                        }
                    }
                } header: {
                    Text("Vídeo / Referência Técnica")
                } footer: {
                    Text("Salve o link de demonstração da técnica para revisar antes dos treinos.")
                }
            }
            .navigationTitle("Detalhes da Técnica")
            #if os(iOS)
            .navigationBarTitleDisplayMode(.inline)
            #endif
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancelar") {
                        dismiss()
                    }
                }

                ToolbarItem(placement: .confirmationAction) {
                    Button("Salvar") {
                        let normalizedMedia = validMediaURL?.absoluteString ?? mediaUrlText.trimmingCharacters(in: .whitespacesAndNewlines)
                        engine.updateNotesAndMedia(
                            for: requirement,
                            notes: notesText,
                            mediaUrl: normalizedMedia,
                            isCompleted: isCompleted
                        )
                        dismiss()
                    }
                    .font(.body.bold())
                    .foregroundColor(belt.color)
                }
            }
        }
    }
}
