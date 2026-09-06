import SwiftUI

public struct BeltSelectorBar: View {
    @Bindable var engine: ProgressEngine

    public init(engine: ProgressEngine) {
        self.engine = engine
    }

    public var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 10) {
                ForEach(Belt.defaultBelts) { belt in
                    let isSelected = engine.selectedBelt.id == belt.id
                    let beltProgress = engine.progress(for: belt)

                    Button {
                        withAnimation(.spring(response: 0.35, dampingFraction: 0.72)) {
                            engine.selectBelt(belt)
                        }
                    } label: {
                        HStack(spacing: 6) {
                            Circle()
                                .fill(belt.color)
                                .frame(width: 10, height: 10)

                            Text(belt.name)
                                .font(.system(size: 15, weight: isSelected ? .bold : .medium))

                            Text(beltProgress.formattedPercentage)
                                .font(.system(size: 12, weight: .bold))
                                .padding(.horizontal, 6)
                                .padding(.vertical, 2)
                                .background(
                                    Capsule()
                                        .fill(isSelected ? Color.white.opacity(0.25) : belt.lightColor)
                                )
                                .foregroundColor(isSelected ? .white : belt.textColor)
                        }
                        .padding(.horizontal, 14)
                        .padding(.vertical, 10)
                        .background(
                            RoundedRectangle(cornerRadius: 12, style: .continuous)
                                .fill(isSelected ? belt.color : Color.appSecondarySystemBackground)
                        )
                        .foregroundColor(isSelected ? .white : .primary)
                        .overlay(
                            RoundedRectangle(cornerRadius: 12, style: .continuous)
                                .stroke(isSelected ? Color.clear : belt.color.opacity(0.2), lineWidth: 1)
                        )
                        .shadow(color: isSelected ? belt.color.opacity(0.3) : Color.clear, radius: 4, y: 2)
                    }
                    .buttonStyle(.plain)
                    .accessibilityElement(children: .combine)
                    .accessibilityLabel("Faixa \(belt.name)")
                    .accessibilityValue("\(beltProgress.formattedPercentage) concluído, \(beltProgress.formattedCount)")
                    .accessibilityAddTraits(isSelected ? [.isSelected] : [])
                }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 4)
        }
    }
}
