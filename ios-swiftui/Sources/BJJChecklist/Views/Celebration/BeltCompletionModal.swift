import SwiftUI

public struct BeltCompletionModal: View {
    @Environment(\.dismiss) private var dismiss
    let belt: Belt
    let totalCount: Int

    public init(belt: Belt, totalCount: Int) {
        self.belt = belt
        self.totalCount = totalCount
    }

    public var body: some View {
        VStack(spacing: 24) {
            Spacer()

            // Icon / Trophy
            ZStack {
                Circle()
                    .fill(belt.lightColor)
                    .frame(width: 120, height: 120)

                Circle()
                    .stroke(belt.color.opacity(0.3), lineWidth: 4)
                    .frame(width: 130, height: 130)

                Image(systemName: "trophy.fill")
                    .font(.system(size: 60))
                    .foregroundColor(belt.color)
            }

            VStack(spacing: 8) {
                Text("Parabéns! 🥋")
                    .font(.system(size: 28, weight: .black, design: .rounded))
                    .foregroundColor(.primary)

                Text("Faixa " + belt.name + " Completa!")
                    .font(.system(size: 22, weight: .bold))
                    .foregroundColor(belt.color)

                Text("Você concluiu todas as " + String(totalCount) + " técnicas desta faixa. Continue treinando: sua graduação é definida pelo seu professor.")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 24)
            }

            // Stat card
            HStack(spacing: 20) {
                VStack(spacing: 4) {
                    Text(String(totalCount))
                        .font(.title.bold())
                        .foregroundColor(belt.color)
                    Text("Técnicas")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }

                Divider()
                    .frame(height: 36)

                VStack(spacing: 4) {
                    Text("100%")
                        .font(.title.bold())
                        .foregroundColor(.green)
                    Text("Concluído")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
            }
            .padding(.horizontal, 32)
            .padding(.vertical, 16)
            .background(
                RoundedRectangle(cornerRadius: 16, style: .continuous)
                    .fill(Color.appSecondarySystemBackground)
            )

            Spacer()

            // Actions
            VStack(spacing: 12) {
                ShareLink(
                    item: "🥋 Completei meu checklist da Faixa " + belt.name + " no Minha Próxima Faixa by tatame0. Seguindo firme rumo à próxima faixa! OSS!"
                ) {
                    HStack {
                        Image(systemName: "square.and.arrow.up")
                        Text("Compartilhar Conquista")
                    }
                    .font(.headline)
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .frame(height: 52)
                    .background(belt.color)
                    .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
                }

                Button {
                    dismiss()
                } label: {
                    Text("Continuar Treinando")
                        .font(.subheadline.bold())
                        .foregroundColor(.secondary)
                        .frame(height: 44)
                }
            }
            .padding(.horizontal, 24)
            .padding(.bottom, 16)
        }
        .padding()
    }
}
