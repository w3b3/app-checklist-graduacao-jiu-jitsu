import SwiftUI

public struct TechniqueRowView: View {
    let requirement: TechniqueRequirement
    let isCompleted: Bool
    let hasNotesOrMedia: Bool
    let belt: Belt
    let onToggle: () -> Void
    let onOpenDetail: () -> Void

    public init(
        requirement: TechniqueRequirement,
        isCompleted: Bool,
        hasNotesOrMedia: Bool,
        belt: Belt,
        onToggle: @escaping () -> Void,
        onOpenDetail: @escaping () -> Void
    ) {
        self.requirement = requirement
        self.isCompleted = isCompleted
        self.hasNotesOrMedia = hasNotesOrMedia
        self.belt = belt
        self.onToggle = onToggle
        self.onOpenDetail = onOpenDetail
    }

    public var body: some View {
        HStack(spacing: 12) {
            // Checkbox Button
            Button(action: onToggle) {
                ZStack {
                    RoundedRectangle(cornerRadius: 8, style: .continuous)
                        .fill(isCompleted ? belt.color : Color.clear)
                        .frame(width: 26, height: 26)

                    RoundedRectangle(cornerRadius: 8, style: .continuous)
                        .stroke(isCompleted ? belt.color : Color.secondary.opacity(0.4), lineWidth: 2)
                        .frame(width: 26, height: 26)

                    if isCompleted {
                        Image(systemName: "checkmark")
                            .font(.system(size: 13, weight: .black))
                            .foregroundColor(.white)
                    }
                }
            }
            .buttonStyle(.borderless)
            .accessibilityLabel(isCompleted ? "Marcar \(requirement.name) como não concluída" : "Marcar \(requirement.name) como concluída")
            .accessibilityHint("Toque para alternar o status de conclusão")

            // Technique Info
            VStack(alignment: .leading, spacing: 4) {
                HStack(spacing: 6) {
                    Text(requirement.name)
                        .font(.system(size: 15, weight: isCompleted ? .medium : .semibold))
                        .foregroundColor(isCompleted ? .secondary : .primary)
                        .strikethrough(isCompleted, color: .secondary.opacity(0.6))
                        .lineLimit(2)

                    if hasNotesOrMedia {
                        Image(systemName: "note.text")
                            .font(.system(size: 12))
                            .foregroundColor(belt.color)
                            .accessibilityLabel("Contém anotações ou vídeo")
                    }
                }

                HStack(spacing: 6) {
                    Text(requirement.techniqueType.displayName)
                        .font(.system(size: 11, weight: .regular))
                        .foregroundColor(.secondary)

                    if let target = requirement.targetCount {
                        Text("• \(target)x")
                            .font(.system(size: 11, weight: .bold))
                            .foregroundColor(belt.color)
                    }
                }
            }

            Spacer()

            // Detail / Edit Button
            Button(action: onOpenDetail) {
                Image(systemName: "info.circle")
                    .font(.system(size: 18))
                    .foregroundColor(belt.color.opacity(0.85))
                    .frame(width: 32, height: 32)
            }
            .buttonStyle(.borderless)
            .accessibilityLabel("Ver detalhes e editar anotações de \(requirement.name)")
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 10)
        .background(Color.appSystemBackground)
    }
}
