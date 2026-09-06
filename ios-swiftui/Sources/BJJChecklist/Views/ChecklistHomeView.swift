import SwiftUI
import SwiftData

public struct ChecklistHomeView: View {
    @Bindable var engine: ProgressEngine
    @Environment(\.modelContext) private var modelContext
    #if os(iOS)
    @Environment(\.horizontalSizeClass) private var horizontalSizeClass
    #endif

    public init(engine: ProgressEngine) {
        self.engine = engine
    }

    private var isSearching: Bool {
        !engine.searchText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
    }

    public var body: some View {
        #if os(iOS)
        if horizontalSizeClass == .regular {
            tabletDualPaneView
        } else {
            phoneSinglePaneView
        }
        #else
        phoneSinglePaneView
        #endif
    }

    // MARK: - Phone (Compact) Single Column View

    @ViewBuilder
    private var phoneSinglePaneView: some View {
        NavigationStack {
            VStack(spacing: 0) {
                // Gym offline header badge
                gymOfflineHeader
                    .padding(.horizontal, 16)
                    .padding(.top, 8)
                    .padding(.bottom, 4)

                // Belt selector tabs
                BeltSelectorBar(engine: engine)
                    .padding(.vertical, 6)

                // Animated progress bar
                BeltProgressBar(
                    belt: engine.selectedBelt,
                    progress: engine.currentBeltProgress
                )
                .padding(.bottom, 8)

                // Techniques section list
                techniquesList
            }
            .navigationTitle("Checklist de Graduação")
            #if os(iOS)
            .navigationBarTitleDisplayMode(.inline)
            #endif
            .searchable(
                text: $engine.searchText,
                prompt: "Buscar técnica, posição ou anotação..."
            )
            .toolbar {
                toolbarContent
            }
            .confirmationDialog(
                "Resetar Progresso?",
                isPresented: $engine.isResetConfirmationPresented,
                titleVisibility: .visible
            ) {
                resetDialogButtons
            } message: {
                resetDialogMessage
            }
            .sheet(item: $engine.selectedTechniqueForDetail) { technique in
                TechniqueDetailSheet(
                    requirement: technique,
                    belt: engine.selectedBelt,
                    engine: engine
                )
            }
            .sheet(isPresented: $engine.isCompletionCelebrationPresented) {
                celebrationModal
            }
            .onAppear {
                engine.setModelContext(modelContext)
            }
        }
    }

    // MARK: - Tablet (Regular) Dual Column View

    @ViewBuilder
    private var tabletDualPaneView: some View {
        NavigationStack {
            HStack(spacing: 0) {
                // Left Column: Belts Overview & Controls
                VStack(alignment: .leading, spacing: 16) {
                    gymOfflineHeader
                        .padding(.top, 16)

                    Text("Faixas de Graduação")
                        .font(.headline)
                        .foregroundColor(.primary)

                    ScrollView {
                        VStack(spacing: 12) {
                            ForEach(Belt.defaultBelts) { belt in
                                let isSelected = engine.selectedBelt.id == belt.id
                                let progress = engine.progress(for: belt)

                                Button {
                                    withAnimation(.spring(response: 0.35, dampingFraction: 0.72)) {
                                        engine.selectBelt(belt)
                                    }
                                } label: {
                                    VStack(alignment: .leading, spacing: 8) {
                                        HStack {
                                            Circle()
                                                .fill(belt.color)
                                                .frame(width: 14, height: 14)

                                            Text("Faixa \(belt.name)")
                                                .font(.system(size: 16, weight: isSelected ? .bold : .semibold))
                                                .foregroundColor(isSelected ? .white : .primary)

                                            Spacer()

                                            Text(progress.formattedPercentage)
                                                .font(.system(size: 14, weight: .bold, design: .rounded))
                                                .foregroundColor(isSelected ? .white : belt.color)
                                        }

                                        // Mini Progress Track
                                        GeometryReader { geo in
                                            ZStack(alignment: .leading) {
                                                Capsule()
                                                    .fill(isSelected ? Color.white.opacity(0.3) : belt.lightColor)
                                                    .frame(height: 6)

                                                Capsule()
                                                    .fill(isSelected ? Color.white : belt.color)
                                                    .frame(width: max(geo.size.width * CGFloat(progress.percentage), progress.completedCount > 0 ? 6 : 0), height: 6)
                                            }
                                        }
                                        .frame(height: 6)

                                        HStack {
                                            Text(progress.formattedCount)
                                                .font(.caption)
                                                .foregroundColor(isSelected ? .white.opacity(0.85) : .secondary)

                                            Spacer()

                                            if progress.isCompleted {
                                                Image(systemName: "checkmark.seal.fill")
                                                    .foregroundColor(isSelected ? .white : .green)
                                                    .font(.caption)
                                            }
                                        }
                                    }
                                    .padding(14)
                                    .background(
                                        RoundedRectangle(cornerRadius: 14, style: .continuous)
                                            .fill(isSelected ? belt.color : Color.appSecondarySystemBackground)
                                    )
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 14, style: .continuous)
                                            .stroke(isSelected ? Color.clear : belt.color.opacity(0.18), lineWidth: 1)
                                    )
                                    .shadow(color: isSelected ? belt.color.opacity(0.25) : Color.clear, radius: 6, y: 3)
                                }
                                .buttonStyle(.plain)
                                .accessibilityElement(children: .combine)
                                .accessibilityLabel("Faixa \(belt.name)")
                                .accessibilityValue("\(progress.formattedPercentage) concluído")
                                .accessibilityAddTraits(isSelected ? [.isSelected] : [])
                            }
                        }
                    }

                    Spacer()

                    // Reset button for active belt in tablet sidebar
                    Button(role: .destructive) {
                        engine.isResetConfirmationPresented = true
                    } label: {
                        HStack {
                            Image(systemName: "arrow.counterclockwise")
                            Text("Resetar Faixa \(engine.selectedBelt.name)")
                        }
                        .font(.subheadline.bold())
                        .foregroundColor(.red)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 10)
                        .background(
                            RoundedRectangle(cornerRadius: 10, style: .continuous)
                                .fill(Color.red.opacity(0.1))
                        )
                    }
                    .padding(.bottom, 16)
                }
                .frame(width: 320)
                .padding(.horizontal, 20)
                .background(Color.appSystemBackground)

                Divider()

                // Right Column: Active Belt Progress & Techniques List
                VStack(spacing: 0) {
                    BeltProgressBar(
                        belt: engine.selectedBelt,
                        progress: engine.currentBeltProgress
                    )
                    .padding(.vertical, 12)

                    techniquesList
                }
            }
            .navigationTitle("Checklist de Graduação")
            #if os(iOS)
            .navigationBarTitleDisplayMode(.inline)
            #endif
            .searchable(
                text: $engine.searchText,
                prompt: "Buscar técnica, posição ou anotação..."
            )
            .toolbar {
                toolbarContent
            }
            .confirmationDialog(
                "Resetar Progresso?",
                isPresented: $engine.isResetConfirmationPresented,
                titleVisibility: .visible
            ) {
                resetDialogButtons
            } message: {
                resetDialogMessage
            }
            .sheet(item: $engine.selectedTechniqueForDetail) { technique in
                TechniqueDetailSheet(
                    requirement: technique,
                    belt: engine.selectedBelt,
                    engine: engine
                )
            }
            .sheet(isPresented: $engine.isCompletionCelebrationPresented) {
                celebrationModal
            }
            .onAppear {
                engine.setModelContext(modelContext)
            }
        }
    }

    // MARK: - Subviews & Controls

    @ViewBuilder
    private var gymOfflineHeader: some View {
        HStack {
            Label(engine.activeGym.name, systemImage: "building.columns.fill")
                .font(.caption.bold())
                .foregroundColor(.secondary)

            Spacer()

            Label("Modo Offline", systemImage: "wifi.slash")
                .font(.caption2.bold())
                .padding(.horizontal, 6)
                .padding(.vertical, 2)
                .background(Capsule().fill(Color.green.opacity(0.15)))
                .foregroundColor(.green)
        }
    }

    @ToolbarContentBuilder
    private var toolbarContent: some ToolbarContent {
        #if os(iOS)
        ToolbarItemGroup(placement: .topBarTrailing) {
            Menu {
                Button {
                    withAnimation {
                        engine.expandAllCategories()
                    }
                } label: {
                    Label("Expandir Todas", systemImage: "chevron.down.circle")
                }

                Button {
                    withAnimation {
                        engine.collapseAllCategories()
                    }
                } label: {
                    Label("Recolher Todas", systemImage: "chevron.up.circle")
                }

                Divider()

                Button(role: .destructive) {
                    engine.isResetConfirmationPresented = true
                } label: {
                    Label("Resetar Faixa \(engine.selectedBelt.name)", systemImage: "arrow.counterclockwise")
                }
            } label: {
                Image(systemName: "ellipsis.circle")
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(.secondary)
            }
            .accessibilityLabel("Opções do checklist")
        }
        #else
        ToolbarItem(placement: .primaryAction) {
            Button {
                engine.isResetConfirmationPresented = true
            } label: {
                Image(systemName: "arrow.counterclockwise")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(.secondary)
            }
            .accessibilityLabel("Resetar progresso da faixa")
        }
        #endif
    }

    @ViewBuilder
    private var resetDialogButtons: some View {
        Button("Resetar Faixa " + engine.selectedBelt.name, role: .destructive) {
            withAnimation(.spring(response: 0.4, dampingFraction: 0.75)) {
                engine.resetCurrentBelt()
            }
        }
        Button("Cancelar", role: .cancel) {}
    }

    @ViewBuilder
    private var resetDialogMessage: some View {
        Text("Isso irá desmarcar todas as técnicas da Faixa " + engine.selectedBelt.name + ". Suas anotações serão mantidas.")
    }

    @ViewBuilder
    private var celebrationModal: some View {
        if let belt = engine.celebrationBelt ?? Belt.defaultBelts.first(where: { $0.id == engine.selectedBelt.id }) {
            BeltCompletionModal(
                belt: belt,
                totalCount: engine.progress(for: belt).totalCount,
                gymName: engine.activeGym.name
            )
        }
    }

    @ViewBuilder
    private var techniquesList: some View {
        let cats = engine.categories(for: engine.selectedBelt)

        if cats.isEmpty || (cats.allSatisfy { engine.requirements(for: engine.selectedBelt, category: $0).isEmpty }) {
            VStack(spacing: 12) {
                Spacer()
                Image(systemName: "magnifyingglass")
                    .font(.system(size: 40))
                    .foregroundColor(.secondary)
                Text("Nenhuma técnica encontrada")
                    .font(.headline)
                    .foregroundColor(.primary)
                Text("Tente buscar por outro termo ou limpe a busca.")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                Spacer()
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
        } else {
            ScrollView {
                LazyVStack(spacing: 12, pinnedViews: [.sectionHeaders]) {
                    ForEach(cats, id: \.self) { category in
                        let reqs = engine.requirements(for: engine.selectedBelt, category: category)
                        if !reqs.isEmpty {
                            Section {
                                // Auto-expand when searching so matching items are always visible
                                if isSearching || engine.isCategoryExpanded(category) {
                                    VStack(spacing: 1) {
                                        ForEach(reqs) { req in
                                            TechniqueRowView(
                                                requirement: req,
                                                isCompleted: engine.isCompleted(for: req),
                                                hasNotesOrMedia: engine.hasNotesOrMedia(for: req),
                                                belt: engine.selectedBelt,
                                                onToggle: {
                                                    withAnimation(.spring(response: 0.35, dampingFraction: 0.7)) {
                                                        engine.toggleCompletion(for: req)
                                                    }
                                                },
                                                onOpenDetail: {
                                                    engine.selectedTechniqueForDetail = req
                                                }
                                            )

                                            if req.id != reqs.last?.id {
                                                Divider()
                                                    .padding(.leading, 54)
                                            }
                                        }
                                    }
                                    .background(
                                        RoundedRectangle(cornerRadius: 14, style: .continuous)
                                            .fill(Color.appSystemBackground)
                                    )
                                    .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
                                    .padding(.horizontal, 16)
                                    .padding(.bottom, 8)
                                }
                            } header: {
                                CategoryHeaderView(
                                    category: category,
                                    progress: engine.progress(for: engine.selectedBelt, category: category),
                                    isExpanded: isSearching || engine.isCategoryExpanded(category),
                                    beltColor: engine.selectedBelt.color,
                                    onToggle: {
                                        withAnimation(.spring(response: 0.35, dampingFraction: 0.72)) {
                                            engine.toggleCategoryExpanded(category)
                                        }
                                    }
                                )
                            }
                        }
                    }
                }
                .padding(.bottom, 24)
            }
            .background(Color.appSystemGroupedBackground)
        }
    }
}
